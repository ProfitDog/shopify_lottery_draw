package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

// DBConfig 数据库配置
type DBConfig struct {
	Host            string        `mapstructure:"host"`
	Port            int           `mapstructure:"port"`
	Username        string        `mapstructure:"username"`
	Password        string        `mapstructure:"password"`
	DBName          string        `mapstructure:"dbname"`
	Charset         string        `mapstructure:"charset"`
	ParseTime       bool          `mapstructure:"parse_time"`
	Loc             string        `mapstructure:"loc"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	MaxOpenConns    int           `mapstructure:"max_open_conns"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`
}

// AuthConfig 认证相关配置
type AuthConfig struct {
	JWTSecret          string        `mapstructure:"jwt_secret"`
	JWTExpireDuration  time.Duration `mapstructure:"jwt_expire_duration"`
	RefreshTokenExpire time.Duration `mapstructure:"refresh_token_expire"`
}

// LoadConfig 初始化配置
func LoadConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")

	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("failed to read config file: %v", err)
	}
	return nil
}

// GetDBConfig 获取数据库配置
func GetDBConfig() *DBConfig {
	var config DBConfig
	if err := viper.UnmarshalKey("database", &config); err != nil {
		panic(fmt.Sprintf("Failed to parse database config: %v", err))
	}
	return &config
}

// GetAuthConfig 获取认证配置
func GetAuthConfig() *AuthConfig {
	var config AuthConfig
	if err := viper.UnmarshalKey("jwt", &config); err != nil {
		panic(fmt.Sprintf("Failed to parse auth config: %v", err))
	}
	return &config
}

// GetDSN 获取数据库连接字符串
func (c *DBConfig) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=%v&loc=%s",
		c.Username,
		c.Password,
		c.Host,
		c.Port,
		c.DBName,
		c.Charset,
		c.ParseTime,
		c.Loc,
	)
}
