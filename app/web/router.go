package web

import (
	"shopify_lottery_draw/app/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRouter 设置所有路由
func SetupRouter() *gin.Engine {
	router := gin.Default()

	// 注册静态文件路由
	registerStaticRoutes(router)

	// 注册认证路由
	registerAuthRoutes(router)

	// 注册所有路由
	registerRoutes(router)

	return router
}

// registerRoutes 注册所有路由
func registerRoutes(router *gin.Engine) {
	// API 路由组
	api := router.Group("/api")
	{
		// 测试路由
		api.GET("/test", handlers.Test)

		registerLotteryRoutes(api)
		// 在这里添加更多路由...
	}
}
