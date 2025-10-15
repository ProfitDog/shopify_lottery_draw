# Web 路由配置

这个目录包含所有的 Web 路由配置，保持 main 函数简洁。

## 文件说明

- **router.go** - 主路由配置文件，包含 `SetupRouter()` 函数
- **routes_example.go** - 路由组织示例，展示如何按功能模块拆分路由

## 如何添加新路由

### 方式 1: 直接在 router.go 中添加

在 `registerRoutes` 函数的 `api` 路由组中直接添加：

```go
func registerRoutes(router *gin.Engine) {
    api := router.Group("/api")
    {
        api.GET("/test", handlers.Test)
        api.POST("/new-endpoint", handlers.NewHandler)  // 添加新路由
    }
}
```

### 方式 2: 按功能模块拆分（推荐用于大型项目）

1. 创建新的路由文件，例如 `routes_lottery.go`：

```go
package web

import (
    "shopify_lottery_draw/app/handlers"
    "github.com/gin-gonic/gin"
)

func registerLotteryRoutes(api *gin.RouterGroup) {
    lottery := api.Group("/lottery")
    {
        lottery.POST("/create", handlers.CreateLottery)
        lottery.GET("/:id", handlers.GetLottery)
        lottery.POST("/:id/draw", handlers.DrawLottery)
    }
}
```

2. 在 `router.go` 的 `registerRoutes` 函数中调用：

```go
func registerRoutes(router *gin.Engine) {
    api := router.Group("/api")
    {
        api.GET("/test", handlers.Test)
        registerLotteryRoutes(api)  // 注册抽奖路由
    }
}
```

## 中间件

可以在 `SetupRouter` 函数中添加全局中间件：

```go
func SetupRouter() *gin.Engine {
    router := gin.Default()
    
    // 添加全局中间件
    router.Use(gin.Logger())
    router.Use(gin.Recovery())
    // router.Use(middleware.CORS())
    
    registerRoutes(router)
    return router
}
```

或在特定路由组中添加中间件：

```go
func registerRoutes(router *gin.Engine) {
    api := router.Group("/api")
    api.Use(middleware.Auth())  // 为所有 /api 路由添加认证中间件
    {
        // 路由定义...
    }
}
```

