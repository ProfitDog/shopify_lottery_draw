package entities

import "time"

// Token 令牌表
type Token struct {
	ID           uint      `gorm:"primarykey"`
	UserID       uint      `gorm:"index;not null"`
	RefreshToken string    `gorm:"type:varchar(255);not null"`
	ExpiresAt    time.Time `gorm:"not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Token) TableName() string {
	return "tokens"
}
