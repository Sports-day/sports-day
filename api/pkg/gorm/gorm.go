package gorm

import (
	"fmt"
	"time"

	"sports-day/api"
	"sports-day/api/pkg/env"
	"sports-day/api/pkg/errors"

	"github.com/go-sql-driver/mysql"
	gormmysql "gorm.io/driver/mysql"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

func Open(logger gormlogger.Writer) (*gorm.DB, error) {
	config := env.Get()
	mysqlConfig := mysql.Config{
		User:      config.RDB.User,
		Passwd:    config.RDB.Pass,
		Addr:      config.RDB.Address,
		DBName:    config.RDB.Name,
		Net:       "tcp",
		ParseTime: true,
		Loc:       time.Local,
	}
	// create dsn
	dsn := mysqlConfig.FormatDSN()

	// setup logger
	logLevel := gormlogger.Warn
	if config.Debug {
		logLevel = gormlogger.Info
	}
	gormLogger := gormlogger.New(
		logger,
		gormlogger.Config{
			LogLevel:                  logLevel,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// open db
	db, err := gorm.Open(
		gormmysql.Open(dsn),
		&gorm.Config{
			Logger: gormLogger,
		},
	)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	return db, nil
}

func OpenWithRetry(logger gormlogger.Writer) (*gorm.DB, error) {
	const maxRetries = 20
	const retryInterval = 3 * time.Second

	for i := 0; i < maxRetries; i++ {
		db, err := Open(logger)
		if err == nil {
			api.Logger.Info().
				Str("label", "database").
				Msg("Successfully connected to database")
			return db, nil
		}

		api.Logger.Warn().
			Err(err).
			Str("label", "database").
			Int("attempt", i+1).
			Int("max_retries", maxRetries).
			Msg("failed to connect to database. retry...")
		time.Sleep(retryInterval)
	}
	return nil, errors.Wrap(fmt.Errorf("failed to connect to database after %d attempts", maxRetries))
}
