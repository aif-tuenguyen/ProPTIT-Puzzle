package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	"net/http"
)

type GetListRecipientRequest struct {
	SenderID   string  `json:"sender_id"`
	ReceiverID *string `json:"receiver_id"`
}

type GetListRecipientResponse struct {
	SenderID           string
	ReceiverID         string
	PaymentSource      int
	PaymentDestination int
	PaymentType        string
	AccountNumber      string
	PhoneNumber        string
	CardNumber         string
	BankName           string
	ReceiverName       string
}

func GetListRecipient(c *gin.Context) {
	var form GetListRecipientRequest

	if err := c.ShouldBind(&form); err != nil {
		log.Printf("[error] GetListRecipientRequest | Bad request %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Bad request",
		})
		return
	}

	log.Printf("[info] GetListRecipient | form: %v ", form)
	if form.ReceiverID == nil {
		listRecipient, err := models.GetListRecipient(form.SenderID)
		if err != nil {
			log.Printf("[error] GetListRecipient | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		listResponse := make([]GetListRecipientResponse, 0)
		for _, recipient := range listRecipient {
			listResponse = append(listResponse, GetListRecipientResponse{
				SenderID:           recipient.SenderID,
				ReceiverID:         recipient.ReceiverID,
				PaymentSource:      recipient.PaymentSource,
				PaymentDestination: recipient.PaymentDestination,
				PaymentType:        recipient.PaymentType,
				AccountNumber:      recipient.AccountNumber,
				PhoneNumber:        recipient.PhoneNumber,
				CardNumber:         recipient.CardNumber,
				BankName:           recipient.BankName,
				ReceiverName:       recipient.ReceiverName,
			})
		}
		log.Printf("[info] GetBalance | Response %v", listRecipient)
		c.JSON(http.StatusOK, gin.H{
			"status": 1,
			"msg":    "Success",
			"data":   listResponse,
		})
	} else {
		listTrans, err := models.GetListTransaction(form.SenderID, *form.ReceiverID)
		if err != nil {
			log.Printf("[error] GetListRecipient | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		listTransRes := make([]GetListRecipientResponse, 0)
		for _, recipient := range listTrans {
			listTransRes = append(listTransRes, GetListRecipientResponse{
				SenderID:           recipient.SenderUserID,
				ReceiverID:         recipient.ReceiverUserID,
				PaymentSource:      recipient.PaymentSource,
				PaymentDestination: recipient.PaymentDestination,
				PaymentType:        recipient.PaymentType,
				AccountNumber:      recipient.AccountNumber,
				PhoneNumber:        recipient.PhoneNumber,
				CardNumber:         recipient.CardNumber,
				BankName:           recipient.BankName,
				ReceiverName:       recipient.ReceiverName,
			})
		}
		log.Printf("[info] GetBalance | Response %v", listTransRes)
		c.JSON(http.StatusOK, gin.H{
			"status": 1,
			"msg":    "Success",
			"data":   listTransRes,
		})
	}
}
