package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	log.Printf("Health check")
	c.JSON(http.StatusUnauthorized, gin.H{
		"status": http.StatusOK,
		"msg":    "Very good",
	})
}
