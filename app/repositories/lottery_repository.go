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

// CreateLotteryPool 创建奖池
func (r *LotteryRepository) CreateLotteryPool(lotteryPool *entities.LotteryPool) (uint, error) {
	err := r.db.Create(lotteryPool).Error
	if err != nil {
		return 0, err
	}
	return lotteryPool.ID, nil
}

// GetAllActiveLotteryPools 获取所有活动中的奖池信息
func (r *LotteryRepository) GetAllActiveLotteryPools() ([]entities.LotteryPool, error) {
	var pools []entities.LotteryPool
	err := r.db.Where("is_active = ?", true).Find(&pools).Error
	return pools, err
}

// HasActivePool 判断productId是不是活动中的奖池
func (r *LotteryRepository) HasActivePool(productID uint) (bool, error) {
	var count int64
	err := r.db.Model(&entities.LotteryPool{}).Where("product_id = ? AND is_active = ?", productID, true).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// CreateUserHash 创建用户哈希记录
func (r *LotteryRepository) CreateUserHash(userHash *entities.UserHash) error {
	return r.db.Create(userHash).Error
}

// GetAllValidUserHashes 获取所有有效且未开奖的用户哈希记录
func (r *LotteryRepository) GetAllValidUserHashes(userID string) ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("user_id = ? AND is_valid = ? AND is_drawed = ?", userID, true, false).Find(&hashes).Error
	return hashes, err
}

// GetUserHashesByUserID 获取指定用户的所有哈希记录
func (r *LotteryRepository) GetUserHashesByUserID(userID string) ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&hashes).Error
	return hashes, err
}

// 根据lotteryPoolId orderId userHash 来更新用户的userHash记录
func (r *LotteryRepository) UpdateUserHash(lotteryPoolId uint, orderId string, targetHash string) error {
	err := r.db.Model(&entities.UserHash{}).Where("lottery_pool_id = ? AND order_id = ?", lotteryPoolId, orderId).Update("user_hash", targetHash).Error
	return err
}

// 退货
func (r *LotteryRepository) RefundUserHash(lotteryPoolId uint, orderId string) error {
	err := r.db.Model(&entities.UserHash{}).Where("lottery_pool_id = ? AND order_id = ?", lotteryPoolId, orderId).Update("is_valid", false).Error
	return err
}

// GetUserHashesByLotteryPoolID 根据奖池ID获取所有有效的用户哈希记录
func (r *LotteryRepository) GetUserHashesByLotteryPoolID(lotteryPoolID uint) ([]entities.UserHash, error) {
	var hashes []entities.UserHash
	err := r.db.Where("lottery_pool_id = ? AND is_valid = ?", lotteryPoolID, true).Find(&hashes).Error
	return hashes, err
}

// GetLotteryPoolByID 根据奖池ID获取奖池信息
func (r *LotteryRepository) GetLotteryPoolByID(lotteryPoolID uint) (*entities.LotteryPool, error) {
	var pool entities.LotteryPool
	err := r.db.Where("id = ?", lotteryPoolID).First(&pool).Error
	if err != nil {
		return nil, err
	}
	return &pool, nil
}
