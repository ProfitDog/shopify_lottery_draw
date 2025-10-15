package models

import "time"

// User 用户模型
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"uniqueIndex;size:255"`
	Password  string    `json:"-" gorm:"size:255"` // 密码不返回给前端
	Role      string    `json:"role" gorm:"size:50;default:'user'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}
