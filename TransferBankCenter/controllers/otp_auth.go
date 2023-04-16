package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	"net/http"
)

type OTPRequest struct {
	TransactionID int    `json:"transaction_id"`
	OTP           string `json:"otp"`
}

func OtpAuth(c *gin.Context) {
	var form OTPRequest

	if err := c.ShouldBind(&form); err != nil {
		log.Printf("[error] OTPRequest | Bad request %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Bad request",
		})
		return
	}

	log.Printf("[info] OTPRequest | form: %v ", form)
	transaction, err := models.GetTransactionByID(form.TransactionID)
	if err != nil {
		log.Printf("[error] UpdateScenario | %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Something wrong",
		})
		return
	}
	if transaction.Otp == form.OTP {
		// Thực hiện giao dịch
		err := TransferProcess(transaction)
		if err != nil {
			log.Printf("[error] OtpAuth | err: %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status": 1,
			"msg":    "Success",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status": -1,
			"msg":    "Wrong OTP",
		})
	}
}
