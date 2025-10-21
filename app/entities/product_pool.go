package entities

import "time"

// LotteryPool 商品奖池表
type LotteryPool struct {
	ID             uint       `gorm:"primarykey"`
	ProductID      uint       `gorm:"not null"`
	ProductName    string     `gorm:"type:varchar(255);not null"`
	NowTargetSales int        `gorm:"not null;default:1000"`
	TargetSales    int        `gorm:"not null;default:1000"`
	CurrentSales   int        `gorm:"not null;default:0"`
	PoolAmount     float64    `gorm:"type:decimal(20,2);not null;default:0"`
	Status         PoolStatus `gorm:"not null;default:1"`
	DrawTime       *time.Time `gorm:"default:null"`
	CreatedAt      time.Time  `gorm:"autoCreateTime"`
	UpdatedAt      time.Time  `gorm:"autoUpdateTime"`
}

// 奖池状态枚举
type PoolStatus uint

const (
	PoolStatusActive   PoolStatus = 1 // 活跃中 - 可注入
	PoolStatusPaused   PoolStatus = 2 // 已暂停 - 暂停注入
	PoolStatusWaiting  PoolStatus = 3 // 待开奖 - 奖池已关闭注入，等待开奖
	PoolStatusFinished PoolStatus = 4 // 已开奖 - 开奖完成
)

func (LotteryPool) TableName() string {
	return "lottery_pools"
}

// DrawResult 开奖结果表
type DrawResult struct {
	ID            uint      `gorm:"primarykey"`
	LotteryPoolID uint      `gorm:"not null;index"`
	BlockHash     string    `gorm:"type:varchar(64);not null"`
	WinnerHash    string    `gorm:"type:varchar(64);not null"`
	WinnerUserID  string    `gorm:"type:varchar(32);not null;index"`
	WinnerScore   int       `gorm:"not null"`
	PoolAmount    float64   `gorm:"type:decimal(20,2);not null"`
	DrawTime      time.Time `gorm:"not null;index"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func (DrawResult) TableName() string {
	return "draw_results"
}
