package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetOrderLotteryRequest 获取订单参与的抽奖活动请求
type GetOrderLotteryRequest struct {
	OrderNumber string `form:"order_number" binding:"required"`
}

// GetOrderLottery 获取订单参与的抽奖活动信息
func GetOrderLottery(c *gin.Context) {
	var req GetOrderLotteryRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request parameters",
			"error":   err.Error(),
		})
		return
	}

	// TODO: 从数据库获取订单参与的抽奖活动信息
	lottery := LotteryBasicInfo{
		LotteryID: 1,
		Title:     "示例抽奖活动",
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Success",
		"data":    lottery,
	})
}
