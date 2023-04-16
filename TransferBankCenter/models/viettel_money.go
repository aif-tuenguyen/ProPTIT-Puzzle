package models

type ViettelMoney struct {
	ID          int
	DriverID    string
	PhoneNumber string
	UserName    string
	ViettelPay  float64
	Money       float64
}

func GetBalance(PhoneNumber string) (*ViettelMoney, error) {
	viettelMoney := ViettelMoney{}
	err := db.Model(ViettelMoney{}).Where("phone_number").First(&viettelMoney).Error
	if err != nil {
		return nil, err
	}

	return &viettelMoney, nil
}

func GetViettelAccount(phoneNumber string) (*ViettelMoney, error) {
	account := ViettelMoney{}
	err := db.Model(ViettelMoney{}).Where("phone_number = ?", phoneNumber).First(&account).Error

	return &account, err
}

func AddViettelMoney(phoneNumber string, amount float64, source int) error {
	account, err := GetViettelAccount(phoneNumber)
	if err != nil {
		return err
	}
	if source == 0 {
		err = db.Model(ViettelMoney{}).
			Where("phone_number = ?", phoneNumber).
			Update("viettel_pay", account.ViettelPay+amount).Error
		return err
	} else {
		err = db.Model(ViettelMoney{}).
			Where("phone_number = ?", phoneNumber).
			Update("money", account.Money+amount).Error

		return err
	}
}

func SubViettelMoney(phoneNumber string, amount float64, source int) error {
	account, err := GetViettelAccount(phoneNumber)
	if err != nil {
		return err
	}
	if source == 0 {
		err = db.Model(ViettelMoney{}).
			Where("phone_number = ?", phoneNumber).
			Update("viettel_pay", account.ViettelPay-amount).Error
		return err
	} else {
		err = db.Model(ViettelMoney{}).
			Where("phone_number = ?", phoneNumber).
			Update("money", account.Money-amount).Error

		return err
	}
}
