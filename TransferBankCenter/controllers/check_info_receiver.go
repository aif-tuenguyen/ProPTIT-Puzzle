package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
)

type CheckInfoReceiverRequest struct {
	UserID             *string `json:"user_id" binding:"required"`
	ReceiverID         *string `json:"receiver_id"`
	AccountNumber      *string `json:"account_number"`
	CardNumber         *string `json:"card_number"`
	PhoneNumber        *string `json:"phone_number"`
	BankName           *string `json:"bank_name"`
	ReceiverName       *string `json:"receiver_name"`
	PaymentType        *string `json:"payment_type"`
	PaymentSource      *int    `json:"payment_source"`
	PaymentDestination *int    `json:"payment_destination"`
}

type CheckInfoReceiverResponse struct {
	UserID             *string
	ReceiverID         *string
	PaymentType        *string
	AccountNumber      *string
	CardNumber         *string
	PhoneNumber        *string
	BankName           *string
	ReceiverName       *string
	PaymentSource      *int
	PaymentDestination *int
	Status             int
	Message            string
}

func CheckInfoReceiver(c *gin.Context) {
	var form CheckInfoReceiverRequest

	if err := c.ShouldBind(&form); err != nil {
		log.Printf("[error] CheckInfoReceiver | Bad request %v", err)
		c.JSON(http.StatusOK, gin.H{
			"status": setting.AppSetting.StatusError,
			"msg":    "Bad request",
		})
		return
	}
	log.Printf("[info] CheckInfoReceiver | form: %v", form)

	response := CheckInfoReceiverResponse{
		UserID:             form.UserID,
		ReceiverID:         form.ReceiverID,
		PaymentType:        form.PaymentType,
		AccountNumber:      form.AccountNumber,
		CardNumber:         form.CardNumber,
		PhoneNumber:        form.PhoneNumber,
		BankName:           form.BankName,
		ReceiverName:       form.ReceiverName,
		PaymentSource:      form.PaymentSource,
		PaymentDestination: form.PaymentDestination,
		Status:             0,
		Message:            "",
	}

	transaction, err := models.GetTransactionByUserID(*form.UserID, form.AccountNumber, form.CardNumber, form.PhoneNumber, form.ReceiverName)
	if err != nil {
		log.Printf("[error] CheckInfoReceiver | Failed when get transaction: %v", err)
	}
	log.Printf("[info] CheckInfoReceiver | transaction: %v", transaction)
	if *response.PaymentType == "phone_number" {
		if transaction != nil {
			if transaction.PaymentType == "phone_number" {
				log.Printf("HERE | %v", response.AccountNumber)
				if *response.PhoneNumber == "" && transaction.PhoneNumber != "" {
					response.PhoneNumber = &transaction.PhoneNumber
				}
				log.Printf("HERE | %v", response.ReceiverName)
				if *response.ReceiverName == "" {
					if transaction.ReceiverName != "" {
						response.ReceiverName = &transaction.ReceiverName
					}
				}

				if *response.PaymentSource == -1 && transaction.PaymentSource != -1 {
					response.PaymentSource = &transaction.PaymentSource
				}
				if *response.PaymentDestination == -1 && transaction.PaymentDestination != -1 {
					response.PaymentDestination = &transaction.PaymentDestination
				}
			}
		}

		if *response.PhoneNumber != "" && *response.ReceiverName == "" {
			viettelAcc, err := models.GetViettelAccount(*response.PhoneNumber)
			if err != nil {
				log.Printf("[error] CheckInfoReceiver | failed when get viettel money account: %v", err)
			} else {
				response.ReceiverName = &viettelAcc.UserName
			}
		}

		log.Print("HERE")
		// Check đã đủ 3 thông tin hay chưa
		if *response.PhoneNumber != "" && *response.ReceiverName != "" {
			response.Status = 1 // full thoong tin
			response.Message = "Ready to transfer"

		} else {
			response.Status = 0 // not enought
			response.Message = "not enought info"
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			log.Printf("[error] UpdateScenario | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		log.Printf("[info] GetConversationDetail | Response %s", string(responseJSON))
		c.JSON(http.StatusOK, gin.H{
			"status": response.Status,
			"msg":    response.Message,
			"data":   response,
		})

	}
	if *response.PaymentType == "card_number" {
		if transaction != nil {
			if transaction.PaymentType == "card_number" {
				if *response.CardNumber == "" && transaction.CardNumber != "" {
					response.CardNumber = &transaction.CardNumber
				}
				if *response.BankName == "" && transaction.BankName != "" {
					response.BankName = &transaction.BankName
				}
				log.Printf("HERE | %v", response.ReceiverName)
				if *response.ReceiverName == "" {
					if transaction.ReceiverName != "" {
						response.ReceiverName = &transaction.ReceiverName
					}
				}

				if *response.PaymentSource == -1 && transaction.PaymentSource != -1 {
					response.PaymentSource = &transaction.PaymentSource
				}
				if *response.PaymentDestination == -1 && transaction.PaymentDestination != -1 {
					response.PaymentDestination = &transaction.PaymentDestination
				}

			}

		}

		if *response.CardNumber != "" && (*response.BankName == "" || *response.ReceiverName == "") {
			bankAccount, err := models.GetCardNumberInfo(*response.CardNumber)
			if err != nil {
				log.Printf("[error] CheckInfoReceiver | failed when git bank account: %v", err)
			} else {
				if *response.ReceiverName == "" {
					response.ReceiverName = &bankAccount.CustomerName
				}
				if *response.BankName == "" {
					response.BankName = &bankAccount.BankName
				}
			}

		}

		// Check đã đủ 3 thông tin hay chưa
		if *response.CardNumber != "" && *response.BankName != "" && *response.ReceiverName != "" {
			response.Status = 1 // full thoong tin
			response.Message = "Ready to transfer"

		} else {
			response.Status = 0 // not enought
			response.Message = "not enought info"
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			log.Printf("[error] UpdateScenario | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		log.Printf("[info] GetConversationDetail | Response %s", string(responseJSON))
		c.JSON(http.StatusOK, gin.H{
			"status": response.Status,
			"msg":    response.Message,
			"data":   response,
		})

	}
	if *response.PaymentType == "account_number" {
		if transaction != nil {
			if transaction.PaymentType == "account_number" {
				log.Printf("HERE | %v", response.AccountNumber)
				if *response.AccountNumber == "" && transaction.AccountNumber != "" {
					response.AccountNumber = &transaction.AccountNumber
				}
				log.Printf("HERE | %v", response.BankName)
				if *response.BankName == "" && transaction.BankName != "" {
					response.BankName = &transaction.BankName
				}
				log.Printf("HERE | %v", response.ReceiverName)
				if *response.ReceiverName == "" {
					if transaction.ReceiverName != "" {
						response.ReceiverName = &transaction.ReceiverName
					}
				}

				if *response.PaymentSource == -1 && transaction.PaymentSource != -1 {
					response.PaymentSource = &transaction.PaymentSource
				}
				if *response.PaymentDestination == -1 && transaction.PaymentDestination != -1 {
					response.PaymentDestination = &transaction.PaymentDestination
				}
			}
		}

		if *response.AccountNumber != "" && *response.BankName != "" && *response.ReceiverName == "" {
			bankAccount, err := models.GetAccountNumberInfo(*response.AccountNumber, *response.BankName)
			if err != nil {
				log.Printf("[error] CheckInfoReceiver | failed when git bank account: %v", err)
			} else {
				response.ReceiverName = &bankAccount.CustomerName
			}

		}

		log.Print("HERE")
		// Check đã đủ 3 thông tin hay chưa
		if *response.AccountNumber != "" && *response.BankName != "" && *response.ReceiverName != "" {
			response.Status = 1 // full thoong tin
			response.Message = "Ready to transfer"

		} else {
			response.Status = 0 // not enought
			response.Message = "not enought info"
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			log.Printf("[error] UpdateScenario | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
		log.Printf("[info] GetConversationDetail | Response %s", string(responseJSON))
		c.JSON(http.StatusOK, gin.H{
			"status": response.Status,
			"msg":    response.Message,
			"data":   response,
		})
	}

}
