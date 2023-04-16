package util

import "unicode"

func ValidatePassword(password string) bool {
	if len(password) < 8 || len(password) > 20 {
		return false
	}
	number := false
	lower := false
	upper := false
	special := false
	for _, c := range password {
		switch {
		case unicode.IsNumber(c):
			number = true
		case unicode.IsUpper(c):
			upper = true
		case unicode.IsLower(c):
			lower = true
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			special = true
		case unicode.IsLetter(c) || c == ' ':
			continue
		default:
			return false
		}
	}
	if number && lower && upper && special {
		return true
	}
	return false

}
