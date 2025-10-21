package web

import (
	"shopify_lottery_draw/app/handlers"

	"github.com/gin-gonic/gin"
)

// registerLotteryRoutes 注册抽奖相关路由
func registerLotteryRoutes(api *gin.RouterGroup) {
	lottery := api.Group("/lottery")
	{
		// 查询相关接口
		lottery.GET("/user-list", handlers.GetUserLotteryList)
		lottery.GET("/order-info", handlers.GetOrderLottery)
		lottery.GET("/detail", handlers.GetLotteryDetail)
		lottery.POST("/create-pool", handlers.CreateLotteryPool)
		// 需要认证的接口
		// authorized := lottery.Use(middleware.JWTAuth())
		// {
		// TODO: 添加需要认证的抽奖接口
		// authorized.POST("/participate", handlers.ParticipateLottery)
		// authorized.POST("/draw", handlers.DrawLottery)
		// }

		// 管理员接口
		// admin := lottery.Use(middleware.JWTAuth(), middleware.AdminAuth())
		// {
		// TODO: 添加管理员抽奖接口
		// admin.POST("/create", handlers.CreateLottery)
		// admin.PUT("/update", handlers.UpdateLottery)
		// }
	}
}
