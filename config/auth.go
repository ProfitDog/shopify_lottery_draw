package config

import (
	"os"
	"time"
)

// AuthConfig 认证相关配置
type AuthConfig struct {
	JWTSecret          string        `mapstructure:"jwt_secret"`
	JWTExpireDuration  time.Duration `mapstructure:"jwt_expire_duration"`
	RefreshTokenExpire time.Duration `mapstructure:"refresh_token_expire"`
}

// GetAuthConfig 获取认证配置
func GetAuthConfig() *AuthConfig {
	return &AuthConfig{
		JWTSecret:          getEnvOrDefault("JWT_SECRET", "your-secret-key"),
		JWTExpireDuration:  getDurationOrDefault("JWT_EXPIRE_DURATION", 2*time.Hour),
		RefreshTokenExpire: getDurationOrDefault("REFRESH_TOKEN_EXPIRE", 30*24*time.Hour),
	}
}

// 从环境变量获取字符串，如果不存在则返回默认值
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// 从环境变量获取时间间隔，如果不存在或格式错误则返回默认值
func getDurationOrDefault(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
