package handlers

import (
	"net/http"
	"shopify_lottery_draw/app/services"

	"github.com/gin-gonic/gin"
)

// OrderPaidCallbackRequest 订单支付回调请求结构
type OrderPaidCallbackRequest struct {
	OrderNumber string `json:"order_number"` // 订单号
	UserId      string `json:"user_id"`      // 用户ID
	ProductID   uint   `json:"product_id"`   // 商品号
}

var lotteryService = services.GetLotteryService()

// OnOrderPaidCallback 处理订单支付回调
func OnOrderPaidCallback(c *gin.Context) {
	var req OrderPaidCallbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request parameters",
			"error":   err.Error(),
		})
		return
	}

	// 创建奖号记录（从hash_manager获取哈希，写入数据库，写入抽奖维护的数据结构）
	userHash, err := lotteryService.ProcessOrder(req.UserId, req.OrderNumber, req.ProductID, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to create lottery record",
			"error":   err.Error(),
		})
		return
	}

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Order paid callback received successfully",
		"data": gin.H{
			"order_number": req.OrderNumber,
			"user_id":      req.UserId,
			"product_id":   req.ProductID,
			"tx_hash":      userHash,
		},
	})
}
