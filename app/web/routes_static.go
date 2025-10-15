package web

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// registerStaticRoutes 注册静态文件路由
func registerStaticRoutes(router *gin.Engine) {
	// 前端构建文件目录
	frontendDir := "frontend/dist"

	// 设置前端静态文件路由
	router.Static("/assets", frontendDir+"/assets") // 处理前端资源文件
	router.StaticFile("/favicon.ico", frontendDir+"/favicon.ico")

	// 所有前端路由都返回 index.html
	router.NoRoute(func(c *gin.Context) {
		// 如果请求的是 API 路由，返回 404
		if strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
			return
		}

		// 其他路由返回前端 index.html
		c.File(frontendDir + "/index.html")
	})
}
