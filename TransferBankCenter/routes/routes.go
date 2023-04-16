package routes

import (
	"github.com/gin-contrib/location"
	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/controllers"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
	// "go.elastic.co/apm"
)

// CORS ...
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func InitRouter() *gin.Engine {
	r := gin.Default()
	r.Use(CORS())
	//r.Use(cors.Default())
	r.Use(location.Default())
	log.Print(setting.ServerSetting.CorsWhitelist)
	r.GET("/heath", controllers.HealthCheck)
	// Nhập thông tin số tài khoản, tên ngân hàng --> Tên khách hàng | So sánh tên khách hàng nếu có
	r.POST("/checkInfo", controllers.CheckInfoReceiver)
	// Lấy thông tin chuyển tiền dựa vào người thụ hưởng:
	// Nhập số thẻ --> Thông tin ngân hàng + họ tên

	// Nhập số điện thoại --> Họ tên

	// ==> Dựa vào thông giao dịch cũ để điền thông tin: Họ tên, stk, so the,

	// Tạo draft transaction
	r.POST("/getBalance", controllers.GetBalance)
	r.POST("/createTransaction", controllers.CreateTransactionDraft)
	// Authen transaction
	r.POST("/otpAuth", controllers.OtpAuth)
	// Lấy danh sách người thụ hưởng gần nhất của userID: Giao dịch gần nhất
	r.POST("/getListRecipient", controllers.GetListRecipient)
	r.GET("/getHistory/:sender_id", controllers.GetHistory)
	r.POST("/voiceBio", controllers.VoiceBioAuth)
	return r
}
