package models

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var db *gorm.DB
var TimeUnitMap map[string]int64
var MaximumTimeRangeMap map[string]int64
var TimeOffsetMap map[string]int64

type GORMMigrator struct {
	db              *gorm.DB
	autoMigrateList []interface{}
}

func NewGORMMigrator(db *gorm.DB) *GORMMigrator {
	return &GORMMigrator{
		db:              db,
		autoMigrateList: make([]interface{}, 0),
	}
}

func (g *GORMMigrator) addAutoMigrate(model interface{}) {
	g.autoMigrateList = append(g.autoMigrateList, model)
}

func (g *GORMMigrator) MakeMigration() error {
	err := g.db.AutoMigrate(g.autoMigrateList...)
	return err
}

// Setup ... Initializes the database instance
func Setup() {
	var err error
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8&parseTime=True&loc=Local",
		setting.DatabaseSetting.User,
		setting.DatabaseSetting.Password,
		setting.DatabaseSetting.Host,
		setting.DatabaseSetting.Name)
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second,   // Slow SQL threshold
			LogLevel:      logger.Silent, // Log level
			Colorful:      false,         // Disable color
		},
	)
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   setting.DatabaseSetting.TablePrefix, // table name prefix, table for `User` would be `t_users`
			SingularTable: true,                                // use singular table name, table for `User` would be `user` with this option enabled
		},
		Logger: newLogger,
	})

	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}
	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	// sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetMaxIdleConns(setting.DatabaseSetting.MaxIdleConnections)
	sqlDB.SetMaxOpenConns(setting.DatabaseSetting.MaxOpenConnections)

	gormMigrator := NewGORMMigrator(db)
	gormMigrator.addAutoMigrate(Transaction{})
	gormMigrator.addAutoMigrate(BankAccount{})
	gormMigrator.addAutoMigrate(ViettelMoney{})
	gormMigrator.addAutoMigrate(Recipient{})
	err = gormMigrator.MakeMigration()
	if err != nil {
		panic(fmt.Sprintf("something wrong when makemigration GORM: %v", err))
	} else {
		log.Print("Success migrator")
	}

	// Default variables
	TimeUnitMap = map[string]int64{
		"second": 1000,
		"hour":   1000 * 60 * 60,
		"day":    1000 * 60 * 60 * 24,
		"month":  1000 * 60 * 60 * 24,
	}
	MaximumTimeRangeMap = map[string]int64{
		"second": 3600 * 24,
		"hour":   24 * 30,
		"day":    365,
		"month":  365, // month be caculated by days instead
	}
	TimeOffsetMap = map[string]int64{
		"second": 0,
		"hour":   0,
		"day":    1000 * 60 * 60 * 7,
		"month":  1000 * 60 * 60 * 7,
	}
}
