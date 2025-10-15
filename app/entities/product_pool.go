package entities

import "time"

// ProductPool 商品奖池表
type ProductPool struct {
	ID           uint      `gorm:"primarykey"`
	ProductID    int       `gorm:"not null"`
	ProductName  string    `gorm:"type:varchar(255);not null"`
	TargetSales  int       `gorm:"not null;default:1000"`
	CurrentSales int       `gorm:"not null;default:0"`
	PoolAmount   float64   `gorm:"type:decimal(20,2);not null;default:0"`
	IsActive     bool      `gorm:"not null;default:true"`
	DrawWeekDay  int       `gorm:"not null"`
	DrawHour     int       `gorm:"not null"`
	LastDrawTime time.Time `gorm:"index"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (ProductPool) TableName() string {
	return "product_pools"
}

// DrawResult 开奖结果表
type DrawResult struct {
	ID           uint      `gorm:"primarykey"`
	ProductID    int       `gorm:"not null;index"`
	BlockHash    string    `gorm:"type:varchar(64);not null"`
	WinnerHash   string    `gorm:"type:varchar(64);not null"`
	WinnerUserID string    `gorm:"type:varchar(32);not null;index"`
	WinnerScore  int       `gorm:"not null"`
	PoolAmount   float64   `gorm:"type:decimal(20,2);not null"`
	DrawTime     time.Time `gorm:"not null;index"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (DrawResult) TableName() string {
	return "draw_results"
}
