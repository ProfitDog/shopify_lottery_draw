package web

import (
	"github.com/gin-gonic/gin"
)

// 示例：当你需要为某个功能模块添加路由时，可以创建专门的路由文件
// 例如：routes_lottery.go, routes_user.go 等

// registerLotteryRoutes 注册抽奖相关路由（示例）
func registerLotteryRoutes(api *gin.RouterGroup) {
	lottery := api.Group("/lottery")
	{
		_ = lottery // 避免未使用变量警告，实际使用时删除此行
		// lottery.POST("/create", handlers.CreateLottery)
		// lottery.GET("/:id", handlers.GetLottery)
		// lottery.POST("/:id/draw", handlers.DrawLottery)
		// lottery.GET("/:id/results", handlers.GetLotteryResults)
	}
}

// registerUserRoutes 注册用户相关路由（示例）
func registerUserRoutes(api *gin.RouterGroup) {
	user := api.Group("/user")
	{
		_ = user // 避免未使用变量警告，实际使用时删除此行
		// user.POST("/login", handlers.UserLogin)
		// user.POST("/register", handlers.UserRegister)
		// user.GET("/profile", handlers.GetUserProfile)
	}
}
