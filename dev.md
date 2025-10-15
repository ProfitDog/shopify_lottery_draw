your-gin-project
├── main.go                 # 应用入口
├── go.mod                 # Go 模块文件
├── config                 # 配置文件目录
│   └── config.yaml
├── app                    # 核心应用目录 (有时也命名为 pkg 或 internal)
│   ├── models            # 🗂️ 模型层 (Model) - 定义数据结构
│   │   ├── user.go
│   │   └── product.go
│   ├── repositories      # 数据访问层 (DAO/Repository) - 封装数据库操作
│   │   ├── user_repo.go
│   │   └── product_repo.go
│   ├── services          # 业务逻辑层 (Service) - 实现核心业务
│   │   ├── user_service.go
│   │   └── product_service.go
│   ├── handlers          # 或 controllers - 控制层，处理HTTP请求
│   │   ├── user_handler.go
│   │   └── product_handler.go
│   ├── requests          # 请求结构体 (如参数绑定与校验)
│   │   └── user_request.go
│   ├── responses         # 响应结构体
│   │   └── user_response.go
│   └── middleware        # 中间件
│       └── auth.go
├── routers               # 路由定义
│   └── router.go
├── database             # 数据库相关 (如迁移脚本)
│   └── migrations
├── storage              # 存储 (日志、上传文件等)
│   └── logs
└── utils                # 工具函数
    └── encryption.go


开发模式
pnpm dev

生产构建
pnpm build