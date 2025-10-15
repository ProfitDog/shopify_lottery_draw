package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetUserLotteryListRequest 获取用户参与的抽奖活动列表请求
type GetUserLotteryListRequest struct {
	UserID uint `form:"user_id" binding:"required"`
}

// LotteryBasicInfo 抽奖活动基础信息
type LotteryBasicInfo struct {
	LotteryID uint   `json:"lottery_id"`
	Title     string `json:"title"`
}

// GetUserLotteryList 获取用户参与的抽奖活动列表
func GetUserLotteryList(c *gin.Context) {
	var req GetUserLotteryListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request parameters",
			"error":   err.Error(),
		})
		return
	}

	// TODO: 从数据库获取用户参与的抽奖活动列表
	lotteries := []LotteryBasicInfo{
		{
			LotteryID: 1,
			Title:     "示例抽奖活动1",
		},
		{
			LotteryID: 2,
			Title:     "示例抽奖活动2",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Success",
		"data":    lotteries,
	})
}
