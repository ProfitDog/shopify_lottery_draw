package models

import (
	"shopify_lottery_draw/app/entities"
	"time"
)

// LotteryPool 抽奖池
type LotteryPool struct {
	ProductID      uint                `json:"product_id"`       // 商品ID
	LotteryPoolID  uint                `json:"lottery_pool_id"`  // 抽奖池ID
	ProductName    string              `json:"product_name"`     // 商品名称
	NowTargetSales int                 `json:"now_target_sales"` // 当前开奖的目标销量
	TargetSales    int                 `json:"target_sales"`     // 下一轮开奖的目标销量（默认1000）
	CurrentSales   int                 `json:"current_sales"`    // 当前销量
	PoolAmount     float64             `json:"pool_amount"`      // 奖池金额
	Status         entities.PoolStatus `json:"status"`           // 奖池状态
	CreatedAt      time.Time           `json:"created_at"`       // 创建时间
	DrawTime       *time.Time          `json:"draw_time"`        // 开奖时间
}

// UserHash 用户哈希值记录
type UserHash struct {
	ID          int        `json:"id"`
	UserID      string     `json:"user_id"`       // 用户ID
	OrderID     string     `json:"order_id"`      // 订单ID
	ProductID   int        `json:"product_id"`    // 商品ID
	TxHash      string     `json:"tx_hash"`       // 分配的比特币交易哈希
	IsValid     bool       `json:"is_valid"`      // 是否有效（未退货）
	ResetCount  int        `json:"reset_count"`   // 重置次数
	CreatedAt   time.Time  `json:"created_at"`    // 创建时间
	LastResetAt *time.Time `json:"last_reset_at"` // 最后重置时间
	RefundAt    *time.Time `json:"refund_at"`     // 退货时间
}

// DrawResult 开奖结果
type DrawResult struct {
	ID            int       `json:"id"`
	LotteryPoolID uint      `json:"lottery_pool_id"` // 抽奖池ID
	ProductID     uint      `json:"product_id"`      // 商品ID
	BlockHash     string    `json:"block_hash"`      // 开奖区块哈希
	WinnerHash    string    `json:"winner_hash"`     // 中奖者哈希
	WinnerUserID  string    `json:"winner_user_id"`  // 中奖者用户ID
	WinnerScore   int       `json:"winner_score"`    // 中奖者得分
	PoolAmount    float64   `json:"pool_amount"`     // 奖池金额
	DrawTime      time.Time `json:"draw_time"`       // 开奖时间
}

// ResetRequest 重置请求
type ResetRequest struct {
	UserID string  `json:"user_id"`
	HashID int     `json:"hash_id"`
	Amount float64 `json:"amount"` // 支付金额，应为$1
}

// RefundRequest 退货请求
type RefundRequest struct {
	UserID  string `json:"user_id"`
	OrderID string `json:"order_id"`
}

// DrawSchedule 开奖计划
type DrawSchedule struct {
	ProductID     uint      `json:"product_id"`
	LotteryPoolID uint      `json:"lottery_pool_id"` // 抽奖池ID
	ProductName   string    `json:"product_name"`
	CurrentSales  int       `json:"current_sales"`
	TargetSales   int       `json:"target_sales"`
	Progress      float64   `json:"progress"`       // 进度百分比
	NextDrawTime  time.Time `json:"next_draw_time"` // 预计下次开奖时间
	PoolAmount    float64   `json:"pool_amount"`
}
