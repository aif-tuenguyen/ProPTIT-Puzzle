package util

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// StringToStringArray ...
func StringToStringArray(s *string) ([]string, error) {
	if s == nil {
		return make([]string, 0), nil
	}
	if len(*s) < 2 {
		return make([]string, 0), fmt.Errorf("cant convert string to string array: wrong format")
	}

	oldValue := *s
	if oldValue[len(oldValue)-1] != ']' || oldValue[0] != '[' {
		return make([]string, 0), fmt.Errorf("cant convert string to string array: wrong format")
	}
	newValue := oldValue[1 : len(oldValue)-1]
	if len(newValue) == 0 {
		return make([]string, 0), nil
	}

	arr := strings.Split(newValue, ",")

	return arr, nil
}

// StringToIntArray ...
func StringToIntArray(s *string) ([]int, error) {
	if s == nil {
		return make([]int, 0), nil
	}

	if len(*s) < 2 {
		return make([]int, 0), fmt.Errorf("cant convert string to int array: wrong format")
	}

	oldValue := *s
	if oldValue[len(oldValue)-1] != ']' || oldValue[0] != '[' {
		return make([]int, 0), fmt.Errorf("cant convert string to int array: wrong format")
	}

	newValue := oldValue[1 : len(oldValue)-1]
	if len(newValue) == 0 {
		return make([]int, 0), nil
	}

	arr := strings.Split(newValue, ",")

	res := make([]int, 0)
	for _, str := range arr {
		num, err := strconv.Atoi(str)
		if err != nil {
			return make([]int, 0), err
		}
		res = append(res, num)
	}

	return res, nil
}

func ArrayToString(arr []int) (string, error) {
	if len(arr) == 0 {
		return "()", nil
	}
	resString := "("
	for _, ele := range arr {
		resString += strconv.Itoa(ele) + ","
	}
	resString = resString[:len(resString)-1] + ")"
	return resString, nil
}

func CopyMap(m map[string]interface{}) map[string]interface{} {
	cp := make(map[string]interface{})
	for k, v := range m {
		vm, ok := v.(map[string]interface{})
		if ok {
			cp[k] = CopyMap(vm)
		} else {
			cp[k] = v
		}
	}

	return cp
}

func CopyGinH(m gin.H) gin.H {
	cp := make(gin.H)
	for k, v := range m {
		vm, ok := v.(gin.H)
		if ok {
			cp[k] = CopyGinH(vm)
		} else {
			cp[k] = v
		}
	}

	return cp
}

func ShortenString(obj interface{}) interface{} {
	// fmt.Printf("Type: %v \n", reflect.TypeOf(obj))
	switch obj.(type) {
	case map[string]interface{}:
		newObj := CopyMap(obj.(map[string]interface{}))
		for key, value := range newObj {
			newObj[key] = ShortenString(value)
		}
		return newObj
	case gin.H:
		newObj := CopyGinH(obj.(gin.H))
		for key, value := range newObj {
			newObj[key] = ShortenString(value)
		}
		return newObj
	case []interface{}:
		arrObj := obj.([]interface{})
		newObj := make([]interface{}, 0)
		for _, ele := range arrObj {
			newObj = append(newObj, ShortenString(ele))
		}
		return newObj
	case []gin.H:
		arrObj := obj.([]gin.H)
		newObj := make([]gin.H, 0)
		for _, ele := range arrObj {
			newObj = append(newObj, ShortenString(ele).(gin.H))
		}
		return newObj

	case []map[string]interface{}:
		arrObj := obj.([]map[string]interface{})
		newObj := make([]map[string]interface{}, 0)
		for _, ele := range arrObj {
			newObj = append(newObj, ShortenString(ele).(map[string]interface{}))
		}
		return newObj
	case string:
		valueString := obj.(string)
		if len(valueString) > 100 {
			valueString = valueString[:100] + "..."
		}
		return valueString
	default:
	}

	return obj
}
