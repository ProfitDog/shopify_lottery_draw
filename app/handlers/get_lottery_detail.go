package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetLotteryDetailRequest 获取奖池详细信息请求
type GetLotteryDetailRequest struct {
	LotteryID uint `form:"lottery_id" binding:"required"`
}

// LotteryDetailInfo 抽奖活动详细信息
type LotteryDetailInfo struct {
	LotteryID      uint     `json:"lottery_id"`
	Title          string   `json:"title"`
	HashNumbers    []string `json:"hash_numbers"`    // 参与的哈希奖号列表
	Status         string   `json:"status"`          // 已开奖/未开奖
	TotalBonus     float64  `json:"total_bonus"`     // 总奖金
	ParticipantNum int      `json:"participant_num"` // 参与人数
	DrawTime       string   `json:"draw_time"`       // 开奖时间
}

// GetLotteryDetail 获取奖池详细信息
func GetLotteryDetail(c *gin.Context) {
	var req GetLotteryDetailRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request parameters",
			"error":   err.Error(),
		})
		return
	}

	// TODO: 从数据库获取奖池详细信息
	detail := LotteryDetailInfo{
		LotteryID:      req.LotteryID,
		Title:          "示例抽奖活动",
		HashNumbers:    []string{"0x123...", "0x456...", "0x789..."},
		Status:         "未开奖",
		TotalBonus:     1000.00,
		ParticipantNum: 3,
		DrawTime:       "2025-12-31 23:59:59",
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Success",
		"data":    detail,
	})
}
