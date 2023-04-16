package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	"net/http"
)

type GetBalanceRequest struct {
	SenderID *string `json:"sender_id"`
	DriverID *string `json:"driver_id"`
}

func GetBalance(c *gin.Context) {
	var form GetBalanceRequest

	if err := c.ShouldBind(&form); err != nil {
		log.Printf("[error] GetBalanceRequest | Bad request %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Bad request",
		})
		return
	}

	log.Printf("[info] GetBalance | form: %v | %v | %v", form, form.SenderID, form.DriverID)

	balance, err := models.GetBalance(*form.SenderID)
	if err != nil {
		log.Printf("[error] UpdateScenario | %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Something wrong",
		})
		return
	}
	log.Print(balance.DriverID)
	log.Print(form.DriverID)
	response := gin.H{
		"viettel_pay":            balance.ViettelPay,
		"money":                  balance.Money,
		"is_available_voice_bio": balance.DriverID == *form.DriverID,
	}
	log.Printf("[info] GetBalance | Response %v", response)
	c.JSON(http.StatusOK, gin.H{
		"status": 1,
		"msg":    "Success",
		"data":   response,
	})

}
