package handlers

import (
	"net/http"
	"shopify_lottery_draw/app/services"

	"github.com/gin-gonic/gin"
)

// CreateLotteryPoolRequest 创建奖池请求结构
type CreateLotteryPoolRequest struct {
	ProductID   uint   `json:"product_id"`   // 商品号
	ProductName string `json:"product_name"` // 商品名称
	TargetSales int    `json:"target_sales"` // 目标销量
}

// CreateLotteryPool 创建奖池
func CreateLotteryPool(c *gin.Context) {
	var req CreateLotteryPoolRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request parameters",
			"error":   err.Error(),
		})
		return
	}

	// 创建奖池
	lotteryService := services.GetLotteryService()
	err := lotteryService.CreatePool(req.ProductID, req.ProductName, req.TargetSales)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to create lottery pool",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "message": "Success"})
}
