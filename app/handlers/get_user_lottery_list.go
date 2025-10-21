package handlers

import (
	"net/http"
	"shopify_lottery_draw/app/services"

	"github.com/gin-gonic/gin"
)

// GetUserLotteryListRequest 获取用户参与的抽奖活动列表请求
type GetUserLotteryListRequest struct {
	UserID string `form:"user_id" binding:"required"`
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

	lotteryService := services.GetLotteryService()
	lotteries, err := lotteryService.GetUserLotteryList(req.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to get user lottery list",
			"error":   err.Error(),
		})
		return
	}

	// TODO: 从数据库获取用户参与的抽奖活动列表
	lotteryList := map[uint][]string{}
	for _, lottery := range lotteries {
		lotteryList[lottery.LotteryPoolID] = append(lotteryList[lottery.LotteryPoolID], lottery.TxHash)
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "message": "Success", "data": lotteryList})
}
