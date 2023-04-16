package controllers

import "github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"

func TransferProcess(transaction *models.Transaction) error {
	// thực hiện chuyển tiền
	paymentType := transaction.PaymentType
	if paymentType == "account_number" {
		err := models.AddMoney(&transaction.AccountNumber, nil, transaction.Amount)
		if err != nil {
			return err
		}
		// Tru tien viettel money
		err = models.SubViettelMoney(transaction.SenderUserID, transaction.Amount, transaction.PaymentSource)
		if err != nil {
			return err
		}
	}
	if paymentType == "card_number" {
		err := models.AddMoney(nil, &transaction.CardNumber, transaction.Amount)
		if err != nil {
			return err
		}
		// Tru tien viettel money
		err = models.SubViettelMoney(transaction.SenderUserID, transaction.Amount, transaction.PaymentSource)
		if err != nil {
			return err
		}
	}
	if paymentType == "phone_number" {
		// Tru tien nguoi gui
		err := models.SubViettelMoney(transaction.SenderUserID, transaction.Amount, transaction.PaymentSource)
		if err != nil {
			return err
		}
		// Cong tien nguoi nhan
		err = models.AddViettelMoney(transaction.ReceiverUserID, transaction.Amount, transaction.PaymentDestination)
		if err != nil {
			return err
		}
	}
	// Update trạng thái
	statusSuccess := 1
	err := models.UpdateStatus(transaction.ID, statusSuccess)
	return err
}
