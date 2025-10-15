package database

import (
	"crypto/rand"
	"fmt"
)

// GenerateRandomToken 生成随机令牌
func GenerateRandomToken() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return fmt.Sprintf("%x", b)
}
