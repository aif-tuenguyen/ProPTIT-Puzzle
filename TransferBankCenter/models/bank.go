package models

type BankAccount struct {
	ID            int
	AccountNumber string
	CardNumber    string
	BankName      string
	CustomerName  string
	Balance       float64
}

func GetAccountNumberInfo(accountNumber string, bankName string) (*BankAccount, error) {
	account := BankAccount{}
	err := db.Model(BankAccount{}).Where("account_number = ? AND bank_name = ?", accountNumber, bankName).First(&account).Error
	if err != nil {
		return nil, err
	}

	return &account, nil

}

func GetCardNumberInfo(cardNumber string) (*BankAccount, error) {
	account := BankAccount{}
	err := db.Model(BankAccount{}).Where("card_number = ?", cardNumber).First(&account).Error
	if err != nil {
		return nil, err
	}

	return &account, nil
}

func GetAccount(accountNumber *string, cardNumber *string) (*BankAccount, error) {
	account := BankAccount{}
	query := db.Model(BankAccount{})
	if accountNumber != nil {
		query = query.Where("account_number = ?", accountNumber)
	}
	if cardNumber != nil {
		query = query.Where("card_number = ?", cardNumber)
	}
	err := query.First(&account).Error

	return &account, err
}

func AddMoney(accountNumber *string, cardNumber *string, amount float64) error {
	account, err := GetAccount(accountNumber, cardNumber)
	if err != nil {
		return err
	}
	newBalance := account.Balance + amount
	query := db.Model(BankAccount{})
	if accountNumber != nil {
		query = query.Where("account_number = ?", accountNumber)
	}
	if cardNumber != nil {
		query = query.Where("card_number = ?", cardNumber)
	}
	err = query.Update("balance", newBalance).Error

	return err
}

//func SubMoney(accountNumber *string, cardNumber *string, amount float64) error {
//	account, err := GetAccount(accountNumber, cardNumber)
//	if err != nil {
//		return err
//	}
//	newBalance := account.Balance + amount
//	query := db.Model(BankAccount{})
//	if accountNumber != nil {
//		query = query.Where("account_number = ?", accountNumber)
//	}
//	if cardNumber != nil {
//		query = query.Where("card_number = ?", cardNumber)
//	}
//	err = query.Update("balance", newBalance).Error
//
//	return err
//}
