package main

import (
	"flag"
	"fmt"
	"os"

	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/models"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/routes"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
)

func initApp(isDeploy *bool) {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	setting.Setup(isDeploy)
	models.Setup()
	// jwt.Setup()
	// rbmq.Setup()
	// request.Setup()
	// controllers.Setup()
}

func main() {
	var err error
	isDeploy := flag.Bool(
		"deploy",
		false,
		"to know this app is deploy or not, if this app is deploying, load config from envs instead",
	)
	flag.Parse()
	initApp(isDeploy)

	// Start logging config
	var logFile *os.File
	defer logFile.Close()
	log.Printf("[info] setting.LogSetting: %v", setting.LogSetting)
	if setting.LogSetting.LogType == "file" {
		logFile, err = os.OpenFile(fmt.Sprintf("%s/%s", setting.LogSetting.LogDir, setting.LogSetting.LogFile),
			os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
		if err != nil {
			log.Fatalf("error opening file: %v", err)
		}
		log.SetOutput(logFile)
	}
	// End logging config
	gin.SetMode(setting.ServerSetting.RunMode)
	routersInit := routes.InitRouter()
	readTimeout := setting.ServerSetting.ReadTimeout
	writeTimeout := setting.ServerSetting.WriteTimeout
	endPoint := fmt.Sprintf(":%d", setting.ServerSetting.HTTPPort)
	maxHeaderBytes := 1 << 20

	server := &http.Server{
		Addr:           endPoint,
		Handler:        routersInit,
		ReadTimeout:    readTimeout,
		WriteTimeout:   writeTimeout,
		MaxHeaderBytes: maxHeaderBytes,
	}
	log.Printf("[info] start http server listening %s", endPoint)
	// // Test module
	// userID := 1
	// conversationID := "3a078506-e4d2-4de7-8230-1395c23bc997"
	// conversationLoggings, err := models.ListConversationLogging(&userID, &conversationID)

	// if err != nil {
	// 	log.Printf("[error] TestModule: %v", err)
	// 	return
	// }
	// // log.Printf("[info] TestModule: %v", conversationLoggings[0])
	// messageList, err := controllers.ConvertLoggingToConversationContentBlock(conversationLoggings)
	// if err != nil {
	// 	log.Printf("[error] TestModule: %v", err)
	// }
	// log.Printf("[info] TestModule: messageList = %v", messageList)

	err = server.ListenAndServe()
	if err != nil {
		log.Printf("[error] main | %v", err)
	}
}
