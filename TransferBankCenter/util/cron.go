package util

import (
	"fmt"

	"github.com/robfig/cron"
)

var standardParser = cron.NewParser(
	cron.Minute | cron.Hour | cron.Dom | cron.Month | cron.Dow | cron.Descriptor,
)

func CheckValidCronString(cronString *string) error {
	if cronString == nil {
		return fmt.Errorf("cron string is empty")
	}
	_, err := standardParser.Parse(*cronString)
	if err != nil {
		return err
	}
	return nil
}
