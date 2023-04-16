package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/util"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

type Response struct {
	Success      bool   `json:"success"`
	Message      string `json:"msg"`
	Result       Result `json:"result"`
	ResponseTime string `json:"response_time"`
}

type Result struct {
	Confidence float64 `json:"confidence"`
	Duration   float64 `json:"duration"`
	SNR        float64 `json:"snr"`
	Text       string  `json:"text"`
	Utt        string  `json:"utt"`
	Words      []Word  `json:"words"`
}

type Word struct {
	Confidence float64 `json:"confidence"`
	Length     float64 `json:"length"`
	Start      float64 `json:"start"`
	Word       string  `json:"word"`
}

func VoiceBioAuth(c *gin.Context) {
	file, _ := c.FormFile("file")
	log.Println(file.Filename)
	transID := c.PostForm("transaction_id")
	log.Print(transID)
	senderID := c.PostForm("sender_id")
	log.Print(senderID)
	// Upload the file to specific dst.
	//c.SaveUploadedFile(file, "file/"+file.Filename)

	fileData, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer fileData.Close()

	// Ghi dữ liệu blob vào file mới
	fileBlob, err := ioutil.ReadAll(fileData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fileName := fmt.Sprintf("file/%v.wav", util.GetCurrentTimeByMillisecond())

	err = ioutil.WriteFile(fileName, fileBlob, 0644)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	textASR, err := CheckASR(fileName, "http://103.141.140.202:8078/api/recognize")
	if err != nil {
		log.Printf("[error] OtpAuth | err: %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Something wrong when get ASR",
		})
		return
	}
	log.Printf("TEXT ASR: %v", textASR)
	//if textASR != "Mã xác thực của tôi là 123456" {
	//	log.Printf("[error] OtpAuth | err: %v", err)
	//	c.JSON(http.StatusOK, gin.H{
	//		"status": -2,
	//		"msg":    "wrong otp",
	//	})
	//	return
	//}

	err = CheckVoiceBio(fileName, "http://124.158.5.212:30145/verify_v2", senderID)
	if err != nil {
		log.Printf("[error] OtpAuth | err: %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Not authen",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": 1,
		"msg":    "Success",
	})

}

func CheckASR(filePath string, url string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("audio-file", filepath.Base(filePath))
	if err != nil {
		return "", err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return "", err
	}

	writer.WriteField("token", "6aYANCAt5QIm4bdGNvOYaqLUl8jxLuWW")

	err = writer.Close()
	if err != nil {
		return "", err
	}

	request, err := http.NewRequest("POST", url, body)
	if err != nil {
		return "", err
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Xử lý response
	var respData Response
	respByteData, err := ioutil.ReadAll(resp.Body)
	fmt.Printf("respData: %s", string(respByteData))
	if err != nil {
		return "", err
	}
	err = json.Unmarshal(respByteData, &respData)
	if err != nil {
		return "", err
	}
	// get status from response
	status := respData.Success
	if status != true {
		return "", errors.New("not authen")
	}
	text := respData.Result.Text
	return text, nil
}

func CheckVoiceBio(filePath string, url string, senderID string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filepath.Base(filePath))
	if err != nil {
		return err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return err
	}

	writer.WriteField("spk_id", "1")

	err = writer.Close()
	if err != nil {
		return err
	}

	request, err := http.NewRequest("POST", url, body)
	if err != nil {
		return err
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Xử lý response
	respData := make(map[string]interface{})
	respByteData, err := ioutil.ReadAll(resp.Body)
	fmt.Printf("respData: %s", string(respByteData))
	if err != nil {
		return err
	}
	err = json.Unmarshal(respByteData, &respData)
	if err != nil {
		return err
	}
	// get status from response
	status := respData["status"]
	if status != "success" {
		return errors.New("not authen")
	}
	if respData["is_same"] == false {
		return errors.New("not authen")
	}
	return nil
}
