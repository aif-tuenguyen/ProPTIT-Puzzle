package models

type Recipient struct {
	ID                 int
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
	CreateAt           int64 `gorm:"autoCreateTime:milli;index;not null"`
	UpdateAt           int64 `gorm:"autoUpdateTime:milli;index"`
}

func GetListRecipient(senderID string) ([]Recipient, error) {
	listRecipient := make([]Recipient, 0)
	err := db.Model(Recipient{}).Where("sender_id = ?", senderID).Find(&listRecipient).Error
	if err != nil {
		return nil, err
	}

	return listRecipient, nil
}
