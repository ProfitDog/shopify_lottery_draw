package services

import (
	"fmt"
	"math"
	"shopify_lottery_draw/app/database"
	"shopify_lottery_draw/app/entities"
	"shopify_lottery_draw/app/models"
	"shopify_lottery_draw/app/repositories"
	"sort"
	"sync"
	"time"
)

// LotteryService 抽奖服务
type LotteryService struct {
	pools       map[int]*models.ProductPool     // 商品奖池（内存维护）
	poolHashes  map[uint]*PoolHashes            // 奖池哈希列表 key: LotteryPoolID
	drawResults []models.DrawResult             // 开奖历史
	repo        *repositories.LotteryRepository // 数据库访问层
	mu          sync.RWMutex                    // 读写锁
}

// 分片锁处理
type PoolHashes struct {
	hashes []string
	mu     sync.RWMutex
}

var (
	lotteryService     *LotteryService
	lotteryServiceOnce sync.Once
)

// GetLotteryService 获取抽奖服务单例
func GetLotteryService() *LotteryService {
	lotteryServiceOnce.Do(func() {
		db := database.GetDB()
		lotteryService = &LotteryService{
			pools:      make(map[int]*models.ProductPool),
			poolHashes: make(map[uint]*PoolHashes),
			repo:       repositories.NewLotteryRepository(db),
			mu:         sync.RWMutex{},
		}
		// 初始化一些示例商品奖池
		lotteryService.initSamplePools()
		// 从数据库加载数据初始化奖池
		lotteryService.loadFromDatabase()
	})
	return lotteryService
}

// initSamplePools 初始化示例商品奖池
func (ls *LotteryService) initSamplePools() {
	return
}

// loadFromDatabase 从数据库加载数据初始化奖池
func (ls *LotteryService) loadFromDatabase() {
	// 获取所有有效的用户哈希记录
	userHashes, err := ls.repo.GetAllActiveProductPools()
	if err != nil {
		fmt.Printf("警告: 从数据库加载数据失败: %v\n", err)
		return
	}

	// 按 product_id 分组，初始化奖池哈希列表
	for _, dbHash := range userHashes {
		ls.pools[dbHash.ProductID] = &models.ProductPool{
			ProductID:      dbHash.ProductID,
			LotteryPoolID:  dbHash.LotteryPoolID,
			ProductName:    dbHash.ProductName,
			NowTargetSales: dbHash.NowTargetSales,
			TargetSales:    dbHash.TargetSales,
			CurrentSales:   dbHash.CurrentSales,
			PoolAmount:     dbHash.PoolAmount,
			IsActive:       dbHash.IsActive,
			CreatedAt:      dbHash.CreatedAt,
			LastDrawTime:   dbHash.LastDrawTime,
			DrawWeekDay:    dbHash.DrawWeekDay,
			DrawHour:       dbHash.DrawHour,
		}
		ls.poolHashes[dbHash.LotteryPoolID] = &PoolHashes{
			hashes: make([]string, dbHash.NowTargetSales),
			mu:     sync.RWMutex{},
		}
	}

	fmt.Printf("从数据库加载了 %d 条奖号记录\n", len(userHashes))
}

// CreatePool 创建商品奖池
func (ls *LotteryService) CreatePool(productID int, productName string, targetSales int) error {
	if targetSales <= 0 {
		return fmt.Errorf("目标销量必须大于0")
	}

	if _, exists := ls.pools[productID]; exists {
		return fmt.Errorf("商品 %d 的奖池已存在", productID)
	}

	// 数据库创建奖池
	poolID, err := ls.repo.CreateProductPool(&entities.ProductPool{
		ProductID:      productID,
		ProductName:    productName,
		NowTargetSales: targetSales,
		TargetSales:    targetSales,
		IsActive:       true,
		CreatedAt:      time.Now(),
	})
	if err != nil {
		return fmt.Errorf("创建奖池失败: %v", err)
	}

	ls.mu.Lock()
	ls.pools[productID] = &models.ProductPool{
		LotteryPoolID:  poolID,
		ProductID:      productID,
		ProductName:    productName,
		NowTargetSales: targetSales,
		TargetSales:    targetSales,
		IsActive:       true,
		CreatedAt:      time.Now(),
	}
	ls.mu.Unlock()

	return nil
}

// ProcessOrder 处理订单，分配哈希值（先写数据库，再更新内存）
func (ls *LotteryService) ProcessOrder(userID, orderID string, productID int, profit float64) (string, error) {
	// 判断奖池是否可用
	pool, exists := ls.pools[productID]
	if !exists {
		return "", fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if !pool.IsActive {
		return "", fmt.Errorf("商品 %d 的奖池未激活", productID)

	}

	// 通过哈希管理器获取可用的比特币交易哈希
	hashManager := GetHashManager()
	txHash, err := hashManager.GetHashForPool(ls.poolHashes[pool.LotteryPoolID].hashes)
	if err != nil {
		return "", fmt.Errorf("获取比特币交易哈希失败: %v", err)
	}

	err = ls.repo.CreateUserHash(&entities.UserHash{
		UserID:        userID,
		LotteryPoolID: pool.LotteryPoolID,
		OrderID:       orderID,
		ProductID:     productID,
		TxHash:        txHash,
		IsValid:       true,
		ResetCount:    0,
		CreatedAt:     time.Now(),
		LastResetAt:   time.Time{},
	})
	if err != nil {
		return "", fmt.Errorf("写入数据库失败: %v", err)
	}

	// 添加到奖池哈希列表
	if ls.poolHashes[pool.LotteryPoolID] == nil {
		ls.poolHashes[pool.LotteryPoolID] = &PoolHashes{
			hashes: make([]string, 0),
			mu:     sync.RWMutex{},
		}
	}

	ls.poolHashes[pool.LotteryPoolID].mu.Lock()
	ls.poolHashes[pool.LotteryPoolID].hashes = append(ls.poolHashes[pool.LotteryPoolID].hashes, txHash)
	ls.poolHashes[pool.LotteryPoolID].mu.Unlock()

	// 更新奖池
	ls.mu.Lock()
	ls.pools[productID].CurrentSales++
	ls.pools[productID].PoolAmount += profit
	ls.mu.Unlock()

	return txHash, nil
}

// ResetHash 重置哈希值
func (ls *LotteryService) ResetHash(userID string, hashID int, amount float64) (*models.UserHash, error) {
	if amount != 1.0 {
		return nil, fmt.Errorf("重置费用必须为 $1")
	}

	// 查找用户哈希记录
	userHashes, exists := ls.userHashes[userID]
	if !exists {
		return nil, fmt.Errorf("用户 %s 没有哈希记录", userID)
	}

	var targetHash *models.UserHash
	for _, hash := range userHashes {
		if hash.ID == hashID && hash.IsValid {
			targetHash = hash
			break
		}
	}

	if targetHash == nil {
		return nil, fmt.Errorf("哈希记录不存在或已失效")
	}

	// 检查重置时间限制（24小时内只能重置一次）
	if time.Since(targetHash.LastResetAt) < 24*time.Hour {
		return nil, fmt.Errorf("24小时内只能重置一次")
	}

	// 通过哈希管理器获取新的可用哈希值
	hashManager := GetHashManager()
	newHash, err := hashManager.GetHashForPool(targetHash.ProductID)
	if err != nil {
		return nil, fmt.Errorf("获取新的比特币交易哈希失败: %v", err)
	}
	targetHash.TxHash = newHash
	targetHash.ResetCount++
	targetHash.LastResetAt = time.Now()

	return targetHash, nil
}

// ProcessRefund 处理退货
func (ls *LotteryService) ProcessRefund(userID, orderID string) error {
	userHashes, exists := ls.userHashes[userID]
	if !exists {
		return fmt.Errorf("用户 %s 没有哈希记录", userID)
	}

	var refundedHash *models.UserHash
	for _, hash := range userHashes {
		if hash.OrderID == orderID && hash.IsValid {
			refundedHash = hash
			break
		}
	}

	if refundedHash == nil {
		return fmt.Errorf("订单 %s 的哈希记录不存在或已失效", orderID)
	}

	// 检查退货时间限制（7天内可以退货）
	if time.Since(refundedHash.CreatedAt) > 7*24*time.Hour {
		return fmt.Errorf("超过7天退货期限")
	}

	// 标记为无效
	now := time.Now()
	refundedHash.IsValid = false
	refundedHash.RefundAt = &now

	// 更新奖池销量和金额
	if pool, exists := ls.pools[refundedHash.ProductID]; exists {
		if pool.CurrentSales > 0 {
			pool.CurrentSales--
		}
		// 注意：这里需要知道原始订单的利润才能正确减少奖池金额
		// 实际应用中应该从订单记录中获取利润信息
	}

	return nil
}

// ConductDraw 执行开奖
func (ls *LotteryService) ConductDraw(productID int, blockHash string) (*models.DrawResult, error) {
	pool, exists := ls.pools[productID]
	if !exists {
		return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if pool.CurrentSales < pool.TargetSales {
		return nil, fmt.Errorf("销量未达到开奖条件 (%d/%d)", pool.CurrentSales, pool.TargetSales)
	}

	// 收集所有有效的用户哈希
	var validHashes []*models.UserHash
	for _, userHashes := range ls.userHashes {
		for _, hash := range userHashes {
			if hash.ProductID == productID && hash.IsValid {
				validHashes = append(validHashes, hash)
			}
		}
	}

	if len(validHashes) == 0 {
		return nil, fmt.Errorf("没有有效的参与者")
	}

	// 计算每个用户的得分
	type ScoreEntry struct {
		Hash      *models.UserHash
		Score     int
		UserID    string
		OrderTime time.Time
	}

	var scores []ScoreEntry
	for _, hash := range validHashes {
		score := ls.calculateScore(hash.TxHash, blockHash)
		scores = append(scores, ScoreEntry{
			Hash:      hash,
			Score:     score,
			UserID:    hash.UserID,
			OrderTime: hash.CreatedAt,
		})
	}

	// 排序：先按得分降序，再按下单时间升序
	sort.Slice(scores, func(i, j int) bool {
		if scores[i].Score != scores[j].Score {
			return scores[i].Score > scores[j].Score
		}
		return scores[i].OrderTime.Before(scores[j].OrderTime)
	})

	if len(scores) == 0 {
		return nil, fmt.Errorf("没有有效的参与者")
	}

	winner := scores[0]

	// 创建开奖结果
	result := &models.DrawResult{
		ID:           ls.nextID,
		ProductID:    productID,
		BlockHash:    blockHash,
		WinnerHash:   winner.Hash.TxHash,
		WinnerUserID: winner.UserID,
		WinnerScore:  winner.Score,
		PoolAmount:   pool.PoolAmount,
		DrawTime:     time.Now(),
	}

	ls.nextID++
	ls.drawResults = append(ls.drawResults, *result)

	// 重置奖池
	pool.CurrentSales = 0
	pool.PoolAmount = 0
	pool.LastDrawTime = time.Now()

	return result, nil
}

// calculateScore 计算哈希匹配得分
func (ls *LotteryService) calculateScore(userHash, blockHash string) int {
	score := 0
	minLen := len(userHash)
	if len(blockHash) < minLen {
		minLen = len(blockHash)
	}

	for i := 0; i < minLen; i++ {
		if userHash[i] == blockHash[i] {
			score++
		}
	}

	return score
}

// GetUserHashes 获取用户哈希记录
func (ls *LotteryService) GetUserHashes(userID string) []*models.UserHash {
	if hashes, exists := ls.userHashes[userID]; exists {
		return hashes
	}
	return []*models.UserHash{}
}

// GetPoolStatus 获取奖池状态
func (ls *LotteryService) GetPoolStatus(productID int) (*models.DrawSchedule, error) {
	pool, exists := ls.pools[productID]
	if !exists {
		return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	progress := float64(pool.CurrentSales) / float64(pool.TargetSales) * 100
	nextDrawTime := ls.calculateNextDrawTime(pool)

	return &models.DrawSchedule{
		ProductID:    pool.ProductID,
		ProductName:  pool.ProductName,
		CurrentSales: pool.CurrentSales,
		TargetSales:  pool.TargetSales,
		Progress:     math.Round(progress*100) / 100,
		NextDrawTime: nextDrawTime,
		PoolAmount:   pool.PoolAmount,
	}, nil
}

// GetAllPoolsStatus 获取所有奖池状态
func (ls *LotteryService) GetAllPoolsStatus() []models.DrawSchedule {
	var schedules []models.DrawSchedule

	for _, pool := range ls.pools {
		progress := float64(pool.CurrentSales) / float64(pool.TargetSales) * 100
		nextDrawTime := ls.calculateNextDrawTime(pool)

		schedules = append(schedules, models.DrawSchedule{
			ProductID:    pool.ProductID,
			ProductName:  pool.ProductName,
			CurrentSales: pool.CurrentSales,
			TargetSales:  pool.TargetSales,
			Progress:     math.Round(progress*100) / 100,
			NextDrawTime: nextDrawTime,
			PoolAmount:   pool.PoolAmount,
		})
	}

	return schedules
}

// calculateNextDrawTime 计算下次开奖时间
func (ls *LotteryService) calculateNextDrawTime(pool *models.ProductPool) time.Time {
	now := time.Now().UTC()

	// 如果当前销量已满，返回当前时间（可以立即开奖）
	if pool.CurrentSales >= pool.TargetSales {
		return now
	}

	// 计算下次开奖时间
	daysUntilTarget := int(math.Ceil(float64(pool.TargetSales-pool.CurrentSales) / 10)) // 假设每天销售10个

	// 找到最近的指定星期几和小时
	targetTime := now.AddDate(0, 0, daysUntilTarget)

	// 调整到指定的星期几
	weekDayDiff := (pool.DrawWeekDay - int(targetTime.Weekday())) % 7
	if weekDayDiff < 0 {
		weekDayDiff += 7
	}
	targetTime = targetTime.AddDate(0, 0, weekDayDiff)

	// 调整到指定的小时
	targetTime = time.Date(targetTime.Year(), targetTime.Month(), targetTime.Day(),
		pool.DrawHour, 0, 0, 0, time.UTC)

	return targetTime
}

// GetDrawHistory 获取开奖历史
func (ls *LotteryService) GetDrawHistory(productID int) []models.DrawResult {
	var results []models.DrawResult
	for _, result := range ls.drawResults {
		if productID == 0 || result.ProductID == productID {
			results = append(results, result)
		}
	}
	return results
}

// GetPool 获取奖池
func (ls *LotteryService) GetPool(productID int) *models.ProductPool {
	if pool, exists := ls.pools[productID]; exists {
		return pool
	}
	return nil
}

// GetPoolHashes 获取奖池的哈希列表
func (ls *LotteryService) GetPoolHashes(productID int) []string {
	if hashes, exists := ls.poolHashes[productID]; exists {
		return hashes
	}
	return []string{}
}

// GetPoolHashCount 获取奖池的哈希数量
func (ls *LotteryService) GetPoolHashCount(productID int) int {
	if hashes, exists := ls.poolHashes[productID]; exists {
		return len(hashes)
	}
	return 0
}
