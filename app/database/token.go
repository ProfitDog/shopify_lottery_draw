package database

import (
	"shopify_lottery_draw/app/models"
)

// TokenRepo 令牌仓库接口
type TokenRepo interface {
	BaseRepo[models.Token]
	FindByUserID(userID uint) (*models.Token, error)
	DeleteByUserID(userID uint) error
}

// TokenRepository 令牌仓库实现
type TokenRepository struct {
	*BaseRepository[models.Token]
}

// NewTokenRepository 创建令牌仓库
func NewTokenRepository() *TokenRepository {
	return &TokenRepository{
		BaseRepository: NewBaseRepository[models.Token](GetDB()),
	}
}

// FindByUserID 通过用户ID查找令牌
func (r *TokenRepository) FindByUserID(userID uint) (*models.Token, error) {
	return r.FindOne("user_id = ?", userID)
}

// DeleteByUserID 通过用户ID删除令牌
func (r *TokenRepository) DeleteByUserID(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.Token{}).Error
}
