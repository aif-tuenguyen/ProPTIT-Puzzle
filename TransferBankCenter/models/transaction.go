package models

type Transaction struct {
	ID                 int `gorm:"primaryKey;index"`
	SenderUserID       string
	ReceiverUserID     string
	PaymentSource      int
	PaymentDestination int
	PaymentType        string
	AccountNumber      string
	PhoneNumber        string
	CardNumber         string
	BankName           string
	ReceiverName       string
	Amount             float64
	Content            string
	Otp                string
	VoiceBio           bool
	Status             int
	CreateAt           int64 `gorm:"autoCreateTime:milli;index;not null"`
	UpdateAt           int64 `gorm:"autoUpdateTime:milli;index"`
}

func UpdateStatus(transactionID int, status int) error {
	return db.Model(Transaction{}).
		Where("id = ?", transactionID).
		Update("status", status).Error
}

func GetHistory(userID string) ([]Transaction, error) {
	listTransaction := make([]Transaction, 0)
	err := db.Model(Transaction{}).Where("sender_user_id = ? OR receiver_user_id = ?", userID, userID).
		Order("create_at DESC").
		Find(&listTransaction).Error
	if err != nil {
		return nil, err
	}

	return listTransaction, nil
}

func GetListTransaction(userID string, receiverID string) ([]Transaction, error) {
	listTransaction := make([]Transaction, 0)
	err := db.Model(Transaction{}).Where("sender_user_id = ? AND receiver_user_id = ?", userID, receiverID).
		Find(&listTransaction).Error
	if err != nil {
		return nil, err
	}

	return listTransaction, nil
}

func GetTransactionByID(transactionID int) (*Transaction, error) {
	transaction := Transaction{}
	err := db.Model(Transaction{}).Where("id = ?", transactionID).First(&transaction).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func GetTransactionByUserID(userID string, accountNumber *string, cardNumber *string, phoneNumber *string, receiverName *string) (*Transaction, error) {
	transaction := Transaction{}
	query := db.Model(Transaction{}).Where("sender_user_id = ?", userID)
	if accountNumber != nil && *accountNumber != "" {
		query = query.Where("account_number = ?", *accountNumber)
	}
	if cardNumber != nil && *cardNumber != "" {
		query = query.Where("card_number = ?", *cardNumber)
	}
	if phoneNumber != nil && *phoneNumber != "" {
		query = query.Where("phone_number = ?", *phoneNumber)
	}
	if receiverName != nil && *receiverName != "" {
		query = query.Where("receiver_name = ?", *receiverName)
	}
	err := query.First(&transaction).Error

	if err != nil {
		return nil, err
	}

	return &transaction, nil
}

func CreateTransaction(
	SenderUserID *string,
	ReceiverUserID *string,
	PaymentSource *int,
	PaymentDestination *int,
	PaymentType *string,
	AccountNumber *string,
	PhoneNumber *string,
	CardNumber *string,
	BankName *string,
	ReceiverName *string,
	Amount *float64,
	Content *string,
	Otp string,
) (*Transaction, error) {
	transaction := Transaction{
		SenderUserID:       *SenderUserID,
		ReceiverUserID:     *ReceiverUserID,
		PaymentSource:      *PaymentSource,
		PaymentDestination: *PaymentDestination,
		PaymentType:        *PaymentType,
		AccountNumber:      *AccountNumber,
		PhoneNumber:        *PhoneNumber,
		CardNumber:         *CardNumber,
		BankName:           *BankName,
		ReceiverName:       *ReceiverName,
		Amount:             *Amount,
		Content:            *Content,
		Otp:                Otp,
		Status:             0, // init
	}
	err := db.Model(Transaction{}).Create(&transaction).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}
