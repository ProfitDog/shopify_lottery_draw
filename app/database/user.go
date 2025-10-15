package database

import (
	"shopify_lottery_draw/app/models"
)

// UserRepo 用户仓库接口
type UserRepo interface {
	BaseRepo[models.User]
	FindByUsername(username string) (*models.User, error)
	// 可以添加更多用户特定的方法
}

// UserRepository 用户仓库实现
type UserRepository struct {
	*BaseRepository[models.User]
}

// NewUserRepository 创建用户仓库
func NewUserRepository() *UserRepository {
	return &UserRepository{
		BaseRepository: NewBaseRepository[models.User](GetDB()),
	}
}

// FindByUsername 通过用户名查找用户
func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	return r.FindOne("username = ?", username)
}
