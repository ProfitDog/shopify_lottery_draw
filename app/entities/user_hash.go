package entities

import "time"

// User 用户表
type User struct {
	ID        uint      `gorm:"primarykey"`
	Username  string    `gorm:"type:varchar(255);uniqueIndex;not null"`
	Password  string    `gorm:"type:varchar(255);not null"`
	Role      string    `gorm:"type:varchar(50);not null;default:'user'"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (User) TableName() string {
	return "users"
}

// UserHash 用户哈希值记录表
type UserHash struct {
	ID            uint       `gorm:"primarykey"`
	UserID        string     `gorm:"type:varchar(255);not null;index"`
	OrderID       string     `gorm:"type:varchar(255);not null;uniqueIndex"`
	LotteryPoolID uint       `gorm:"not null;index"`
	ProductID     uint       `gorm:"not null;index"`
	TxHash        string     `gorm:"type:varchar(255);not null;uniqueIndex"`
	IsValid       bool       `gorm:"not null;default:true"`
	IsDrawed      bool       `gorm:"not null;default:false"`
	ResetCount    int        `gorm:"not null;default:0"`
	LastResetAt   *time.Time `gorm:"default:null"`
	RefundAt      *time.Time `gorm:"default:null"`
	CreatedAt     time.Time  `gorm:"autoCreateTime"`
	UpdatedAt     time.Time  `gorm:"autoUpdateTime"`
}

func (UserHash) TableName() string {
	return "user_hashs"
}
