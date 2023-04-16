package controllers

import (
	"crypto/rand"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	"math/big"
	"net/http"
)

type CreateTransactionDraftRequest struct {
	UserID             *string  `json:"user_id" binding:"required"`
	ReceiverID         *string  `json:"receiver_id"`
	AccountNumber      *string  `json:"account_number"`
	CardNumber         *string  `json:"card_number"`
	PhoneNumber        *string  `json:"phone_number"`
	BankName           *string  `json:"bank_name"`
	ReceiverName       *string  `json:"receiver_name"`
	PaymentType        *string  `json:"payment_type"`
	PaymentSource      *int     `json:"payment_source"`
	PaymentDestination *int     `json:"payment_destination"`
	Amount             *float64 `json:"amount"`
	Content            *string  `json:"content"`
}

func CreateTransactionDraft(c *gin.Context) {
	var form CreateTransactionDraftRequest

	if err := c.ShouldBind(&form); err != nil {
		log.Printf("[error] CreateTransactionDraft | Bad request %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Bad request",
		})
		return
	}
	log.Printf("[info] CreateTransactionDraft | form: %v", form)
	otp := ""
	for i := 0; i < 6; i++ {
		num, _ := rand.Int(rand.Reader, big.NewInt(10))
		otp += fmt.Sprintf("%d", num)
	}
	otp = "123456"
	fmt.Println("Random OTP:", otp)
	transaction, err := models.CreateTransaction(
		form.UserID,
		form.ReceiverID,
		form.PaymentSource,
		form.PaymentDestination,
		form.PaymentType,
		form.AccountNumber,
		form.PhoneNumber,
		form.CardNumber,
		form.BankName,
		form.ReceiverName,
		form.Amount,
		form.Content,
		otp,
	)
	if err != nil {
		log.Printf("[error] CreateTransactionDraft | %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Something wrong",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":         1,
		"msg":            "Success",
		"transaction_id": transaction.ID,
	})

}
