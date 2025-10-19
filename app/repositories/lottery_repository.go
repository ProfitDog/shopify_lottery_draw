package repositories

import (
	"shopify_lottery_draw/app/database"
	"shopify_lottery_draw/app/entities"

	"gorm.io/gorm"
)

type LotteryRepository struct {
	*database.BaseRepository[entities.UserHash]
	db *gorm.DB
}

func NewLotteryRepository(db *gorm.DB) *LotteryRepository {
	return &LotteryRepository{
		BaseRepository: database.NewBaseRepository[entities.UserHash](db),
		db:             db,
	}
}

// CreateProductPool 创建奖池
func (r *LotteryRepository) CreateProductPool(productPool *entities.ProductPool) (uint, error) {
	err := r.db.Create(productPool).Error
	if err != nil {
		return 0, err
	}
	return productPool.ID, nil
}

// GetAllActiveProductPools 获取所有活动中的奖池信息
func (r *LotteryRepository) GetAllActiveProductPools() ([]entities.ProductPool, error) {
	var pools []entities.ProductPool
	err := r.db.Where("is_active = ?", true).Find(&pools).Error
	return pools, err
}

// CreateUserHash 创建用户哈希记录
func (r *LotteryRepository) CreateUserHash(userHash *entities.UserHash) error {
	return r.db.Create(userHash).Error
}

// GetAllValidUserHashes 获取所有有效的用户哈希记录
func (r *LotteryRepository) GetAllValidUserHashes() ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("is_valid = ?", true).Find(&hashes).Error
	return hashes, err
}

// GetUserHashesByProductID 获取指定商品的所有有效哈希
func (r *LotteryRepository) GetUserHashesByProductID(productID int) ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("product_id = ? AND is_valid = ?", productID, true).Find(&hashes).Error
	return hashes, err
}

// GetUserHashesByUserID 获取指定用户的所有哈希记录
func (r *LotteryRepository) GetUserHashesByUserID(userID string) ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&hashes).Error
	return hashes, err
}
