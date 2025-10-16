package handlers

import (
	"net/http"
	"time"

	"shopify_lottery_draw/app/database"
	"shopify_lottery_draw/app/models"

	"github.com/gin-gonic/gin"
)

// OrderPaidCallbackRequest 订单支付回调请求结构
type OrderPaidCallbackRequest struct {
	OrderNumber string    `json:"order_number"` // 订单号
	UserId      string    `json:"user_id"`      // 用户ID
	Timestamp   time.Time `json:"timestamp"`    // 交易时间
	ProductID   int       `json:"product_id"`   // 商品号
}

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

	// 验证订单存在性

	// 写入数据库
	database.NewBaseRepository[models.UserHash](database.GetDB()).Create(&models.UserHash{
		UserID:      req.UserId,
		OrderID:     req.OrderNumber,
		ProductID:   req.ProductID,
		TxHash:      req.TransactionID,
		IsValid:     true,
		ResetCount:  0,
		CreatedAt:   time.Now(),
		LastResetAt: time.Now(),
	})

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Order paid callback received successfully",
		"data": gin.H{
			"order_number":   req.OrderNumber,
			"user_id":        req.UserId,
			"transaction_id": req.TransactionID,
			"timestamp":      req.Timestamp,
			"product_id":     req.ProductID,
		},
	})
}
