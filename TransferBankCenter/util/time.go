package util

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

type DailyTime struct {
	Hour   int
	Minute int
}

// GetCurrentTimeByMillisecond ...
func GetCurrentTimeByMillisecond() int64 {
	now := time.Now()
	unixNano := now.UnixNano()
	millisecond := unixNano / 1000000
	return millisecond
}

func CronToDailyTime(cron string) (*DailyTime, error) {
	arr := strings.Split(cron, " ")
	if len(arr) != 5 {
		return nil, fmt.Errorf("cron time format take 5 * but received %d", len(arr))
	}
	minute := 0
	var err error
	if arr[0] != "*" {
		minute, err = strconv.Atoi(arr[0])
		if err != nil {
			return nil, err
		}
	}
	hour := 0
	if arr[1] != "*" {
		hour, err = strconv.Atoi(arr[1])
		if err != nil {
			return nil, err
		}
	}
	dailyTime := DailyTime{
		Minute: minute,
		Hour:   hour,
	}
	return &dailyTime, nil
}

func TimeStringToMillisecond(timeFormat string, timeString string) (int64, error) {
	time, err := time.Parse(timeFormat, timeString)
	if err != nil {
		return 0, err
	}
	return time.UnixMilli(), nil
}

func GetFirstDayOfMonthFromTimestamp(timeStamp int64) (int64, error) {
	timeObj := time.Unix(0, timeStamp*1000000)
	timeString := fmt.Sprintf("%d-%s-01", timeObj.Year(), fmt.Sprintf("%02d", timeObj.Month()))
	timeFormat := "2006-01-02"

	newTimeObj, err := time.Parse(timeFormat, timeString)
	if err != nil {
		return 0, err
	}

	return newTimeObj.UnixMilli(), nil
}

func GetMonthFromTimeStamp(timeStamp int64) int64 {
	timeObj := time.Unix(0, timeStamp*1000000)
	return int64(timeObj.Month())
}

func GetBlockTimeRemain(lastTime int64, blockTime int) int64 {
	currentTime := GetCurrentTimeByMillisecond()
	blockTimeMil := int64(blockTime) * 60000
	distance := currentTime - lastTime
	if distance >= blockTimeMil {
		return 0
	}
	return (blockTimeMil-distance)/60000 + 1
}

// Millisecond to date time
func MillisecondToDateTime(msInt int64) (string, error) {
	dateTime := time.Unix(0, msInt*int64(time.Millisecond))
	dateTimeStr := dateTime.Format("2006-01-02 15:04:05")
	return dateTimeStr, nil
}

func GetMillisecondStartDate(timeMillisecond int64) int64 {
	currentDateStr := time.UnixMilli(timeMillisecond).Format("01-02-2006")
	currentDate, _ := time.Parse("01-02-2006", currentDateStr)
	unixNano := currentDate.UnixNano()
	millisecond := unixNano / 1000000
	// log.Print(millisecond -7*3600000)
	return millisecond - 7*3600000
}
