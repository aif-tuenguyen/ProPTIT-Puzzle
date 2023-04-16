package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	"net/http"
)

func GetHistory(c *gin.Context) {
	senderID := c.Param("sender_id")
	history, err := models.GetHistory(senderID)
	if err != nil {
		if err != nil {
			log.Printf("[error] UpdateScenario | %v", err)
			c.JSON(http.StatusOK, gin.H{
				"status": setting.AppSetting.StatusError,
				"msg":    "Something wrong",
			})
			return
		}
	}

	log.Printf("[info] GetHistory | Response %v", history)
	c.JSON(http.StatusOK, gin.H{
		"status": 1,
		"msg":    "Success",
		"data":   history,
	})
}
