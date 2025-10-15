package main

import (
	"fmt"
	"log"

	"shopify_lottery_draw/app/config"
	"shopify_lottery_draw/app/database"
	"shopify_lottery_draw/app/web"

	"github.com/spf13/viper"
)

func init() {
	// 设置配置文件
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")

	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		panic(fmt.Sprintf("Failed to read config file: %v", err))
	}

	// 初始化数据库
	dbConfig := config.GetDBConfig()
	database.InitDB(dbConfig.GetDSN())

	// 设置连接池参数
	sqlDB, err := database.GetDB().DB()
	if err != nil {
		panic(fmt.Sprintf("Failed to get DB instance: %v", err))
	}

	sqlDB.SetMaxIdleConns(dbConfig.MaxIdleConns)
	sqlDB.SetMaxOpenConns(dbConfig.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(dbConfig.ConnMaxLifetime)

	log.Println("Database initialized successfully")
}

func main() {
	router := web.SetupRouter()
	log.Printf("Server starting on :8080")
	router.Run(":8080")
}
