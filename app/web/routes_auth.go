package web

import (
	"shopify_lottery_draw/app/handlers"
	"shopify_lottery_draw/app/middleware"
	"shopify_lottery_draw/app/services"

	"github.com/gin-gonic/gin"
)

// registerAuthRoutes 注册认证相关路由
func registerAuthRoutes(router *gin.Engine) {
	userService := services.NewUserService()
	authHandler := handlers.NewAuthHandler(userService)

	// 公开路由组
	public := router.Group("/api/auth")
	{
		public.POST("/login", authHandler.Login)
		public.POST("/register", authHandler.Register)
	}

	// 需要认证的路由组
	private := router.Group("/api")
	private.Use(middleware.JWTAuth())
	{
		// 这里添加需要认证的路由
	}

	// 需要管理员权限的路由组
	admin := router.Group("/api/admin")
	admin.Use(middleware.JWTAuth(), middleware.AdminAuth())
	{
		// 这里添加需要管理员权限的路由
	}
}
