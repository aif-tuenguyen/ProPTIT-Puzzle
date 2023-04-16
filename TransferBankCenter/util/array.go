package util

func Remove(s []interface{}, i int) []interface{} {
	s[len(s)-1], s[i] = s[i], s[len(s)-1]
	return s[:len(s)-1]
}

func CheckIntInArray(x int, a []int) bool {
	for _, ai := range a {
		if x == ai {
			return true
		}
	}
	return false
}
