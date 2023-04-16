package util

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetParamInt ... get params integer
func GetParamInt(c *gin.Context, name string) (int, error) {
	val := c.Params.ByName(name)
	if val == "" {
		return 0, nil
	}
	return strconv.Atoi(val)
}
