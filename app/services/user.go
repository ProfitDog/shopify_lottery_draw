package services

import (
	"errors"
	"time"

	"shopify_lottery_draw/app/database"
	"shopify_lottery_draw/app/models"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo  *database.UserRepository
	tokenRepo *database.TokenRepository
}

func NewUserService() *UserService {
	return &UserService{
		userRepo:  database.NewUserRepository(),
		tokenRepo: database.NewTokenRepository(),
	}
}

// CreateUser 创建用户
func (s *UserService) CreateUser(username, password string) (*models.User, error) {
	// 检查用户名是否已存在
	if _, err := s.userRepo.FindByUsername(username); err == nil {
		return nil, errors.New("username already exists")
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username: username,
		Password: string(hashedPassword),
		Role:     "user", // 默认角色
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

// ValidateUser 验证用户凭证
func (s *UserService) ValidateUser(username, password string) (*models.User, error) {
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	return user, nil
}

// GetUserByID 通过ID获取用户
func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	return s.userRepo.FindByID(id)
}

// CreateRefreshToken 创建刷新令牌
func (s *UserService) CreateRefreshToken(userID uint) (*models.Token, error) {
	// 删除该用户的旧令牌
	if err := s.tokenRepo.DeleteByUserID(userID); err != nil {
		return nil, err
	}

	token := &models.Token{
		UserID:       userID,
		RefreshToken: database.GenerateRandomToken(),
		ExpiresAt:    time.Now().Add(time.Hour * 24 * 30), // 30天过期
	}

	if err := s.tokenRepo.Create(token); err != nil {
		return nil, err
	}

	return token, nil
}
