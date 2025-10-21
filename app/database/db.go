package database

import (
	"log"
	"shopify_lottery_draw/app/entities"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB 初始化数据库连接
func InitDB(dsn string) {
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	err = db.AutoMigrate(
		&entities.User{},
		&entities.Token{},
		&entities.LotteryPool{},
		&entities.UserHash{},
		&entities.DrawResult{},
	)
	if err != nil {
		log.Fatalf("Failed to auto migrate database: %v", err)
	}

	log.Println("Database tables migrated successfully")
}

// GetDB 获取数据库实例
func GetDB() *gorm.DB {
	return db
}

// BaseModel 基础模型
type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt int64          `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt int64          `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BaseRepo 基础仓库接口
type BaseRepo[T any] interface {
	Create(model *T) error
	Update(model *T) error
	Delete(id uint) error
	FindByID(id uint) (*T, error)
	FindOne(query interface{}, args ...interface{}) (*T, error)
	Find(query interface{}, args ...interface{}) ([]T, error)
}

// BaseRepository 基础仓库实现
type BaseRepository[T any] struct {
	db *gorm.DB
}

// NewBaseRepository 创建基础仓库
func NewBaseRepository[T any](db *gorm.DB) *BaseRepository[T] {
	return &BaseRepository[T]{db: db}
}

// Create 创建记录
func (r *BaseRepository[T]) Create(model *T) error {
	return r.db.Create(model).Error
}

// Update 更新记录
func (r *BaseRepository[T]) Update(model *T) error {
	return r.db.Save(model).Error
}

// Delete 删除记录
func (r *BaseRepository[T]) Delete(id uint) error {
	var model T
	return r.db.Delete(&model, id).Error
}

// FindByID 通过ID查找记录
func (r *BaseRepository[T]) FindByID(id uint) (*T, error) {
	var model T
	err := r.db.First(&model, id).Error
	if err != nil {
		return nil, err
	}
	return &model, nil
}

// FindOne 查找单条记录
func (r *BaseRepository[T]) FindOne(query interface{}, args ...interface{}) (*T, error) {
	var model T
	err := r.db.Where(query, args...).First(&model).Error
	if err != nil {
		return nil, err
	}
	return &model, nil
}

// Find 查找多条记录
func (r *BaseRepository[T]) Find(query interface{}, args ...interface{}) ([]T, error) {
	var models []T
	err := r.db.Where(query, args...).Find(&models).Error
	if err != nil {
		return nil, err
	}
	return models, nil
}
