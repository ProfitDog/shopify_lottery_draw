package services

import (
	"fmt"
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
	pools       map[uint]*models.LotteryPool    // 商品奖池（内存维护）
	poolHashs   map[uint]*PoolHashs             // 奖池哈希列表 key: LotteryPoolID
	drawResults []models.DrawResult             // 开奖历史
	repo        *repositories.LotteryRepository // 数据库访问层
	mu          sync.RWMutex                    // 读写锁
}

// 分片锁处理
type PoolHashs struct {
	hashs []string
	mu    sync.RWMutex
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
			pools:     make(map[uint]*models.LotteryPool),
			poolHashs: make(map[uint]*PoolHashs),
			repo:      repositories.NewLotteryRepository(db),
			mu:        sync.RWMutex{},
		}
		// 初始化一些示例商品奖池
		lotteryService.initSamplePools()
		// 从数据库加载数据初始化奖池
		lotteryService.loadFromDatabase()
	})

	return lotteryService
}

// TODO: initSamplePools 初始化示例商品奖池
func (ls *LotteryService) initSamplePools() {
	return
}

// loadFromDatabase 从数据库加载数据初始化奖池
func (ls *LotteryService) loadFromDatabase() {
	// 获取所有有效的用户哈希记录
	lotteryPools, err := ls.repo.GetAllActiveLotteryPools()
	if err != nil {
		fmt.Printf("警告: 从数据库加载数据失败: %v\n", err)
		return
	}

	// 按 LotteryPoolId 分组，初始化奖池哈希列表
	for _, dbLotteryPool := range lotteryPools {
		ls.pools[dbLotteryPool.ID] = &models.LotteryPool{
			LotteryPoolID:  dbLotteryPool.ID,
			ProductID:      dbLotteryPool.ProductID,
			ProductName:    dbLotteryPool.ProductName,
			NowTargetSales: dbLotteryPool.NowTargetSales,
			TargetSales:    dbLotteryPool.TargetSales,
			CurrentSales:   dbLotteryPool.CurrentSales,
			PoolAmount:     dbLotteryPool.PoolAmount,
			Status:         dbLotteryPool.Status,
			CreatedAt:      dbLotteryPool.CreatedAt,
		}
		ls.poolHashs[dbLotteryPool.ID] = &PoolHashs{
			hashs: make([]string, dbLotteryPool.NowTargetSales),
			mu:    sync.RWMutex{},
		}
	}

	fmt.Printf("从数据库加载了 %d 条奖号记录\n", len(lotteryPools))
}

// CreatePool 创建商品奖池
func (ls *LotteryService) CreatePool(productId uint, productName string, targetSales int) error {
	if targetSales <= 0 {
		return fmt.Errorf("目标销量必须大于0")
	}

	// 每个商品同时只能存在一个奖池
	hasPool, err := ls.repo.HasActivePool(productId)
	if err != nil {
		return fmt.Errorf("获取奖池失败: %v", err)
	}
	if hasPool {
		return fmt.Errorf("商品 %d 的奖池已存在", productId)
	}

	// 数据库创建奖池
	lotteryPoolID, err := ls.repo.CreateLotteryPool(&entities.LotteryPool{
		ProductID:      productId,
		ProductName:    productName,
		NowTargetSales: targetSales,
		TargetSales:    targetSales,
		Status:         entities.PoolStatusActive,
		CreatedAt:      time.Now(),
	})
	if err != nil {
		return fmt.Errorf("创建奖池失败: %v", err)
	}

	ls.mu.Lock()
	ls.pools[productId] = &models.LotteryPool{
		ProductID:      productId,
		LotteryPoolID:  lotteryPoolID,
		ProductName:    productName,
		NowTargetSales: targetSales,
		TargetSales:    targetSales,
	}
	ls.mu.Unlock()

	return nil
}

// ProcessOrder 处理订单，分配哈希值（先写数据库，再更新内存）
func (ls *LotteryService) ProcessOrder(userID, orderID string, productID uint, profit float64) (string, error) {
	// 判断奖池是否可用
	pool, exists := ls.pools[productID]
	if !exists {
		return "", fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if pool.Status != entities.PoolStatusActive {
		return "", fmt.Errorf("商品 %d 的奖池未激活", productID)

	}

	// 通过哈希管理器获取可用的比特币交易哈希
	hashManager := GetHashManager()
	txHash, err := hashManager.GetHashForPool(ls.poolHashs[pool.LotteryPoolID].hashs)
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
	})
	if err != nil {
		return "", fmt.Errorf("写入数据库失败: %v", err)
	}

	// 添加到奖池哈希列表
	if ls.poolHashs[pool.LotteryPoolID] == nil {
		ls.poolHashs[pool.LotteryPoolID] = &PoolHashs{
			hashs: make([]string, 0),
			mu:    sync.RWMutex{},
		}
	}

	ls.poolHashs[pool.LotteryPoolID].mu.Lock()
	ls.poolHashs[pool.LotteryPoolID].hashs = append(ls.poolHashs[pool.LotteryPoolID].hashs, txHash)
	ls.poolHashs[pool.LotteryPoolID].mu.Unlock()

	// 更新奖池
	ls.mu.Lock()
	ls.pools[productID].CurrentSales++
	ls.pools[productID].PoolAmount += profit
	ls.mu.Unlock()

	return txHash, nil
}

// ResetHash 重置哈希值
func (ls *LotteryService) ResetHash(lotteryPoolId uint, userId string, orderId string, amount float64) error {
	// 占位，判断是否符合重置条件
	if amount != 1.0 {
		return fmt.Errorf("重置费用必须为 $1")
	}

	hashManager := GetHashManager()
	txHash, err := hashManager.GetHashForPool(ls.poolHashs[lotteryPoolId].hashs)
	if err != nil {
		return fmt.Errorf("获取比特币交易哈希失败: %v", err)
	}

	// 先更新数据库中用户抽奖哈希
	err = ls.repo.UpdateUserHash(lotteryPoolId, orderId, txHash)
	if err != nil {
		return fmt.Errorf("检查用户哈希记录失败: %v", err)
	}

	// 查找用户哈希记录
	hashs := ls.poolHashs[lotteryPoolId].hashs
	for index, hash := range hashs {
		if hash == txHash {
			ls.poolHashs[lotteryPoolId].mu.Lock()
			ls.poolHashs[lotteryPoolId].hashs[index] = txHash
			ls.poolHashs[lotteryPoolId].mu.Unlock()
			return nil
		}
	}

	return fmt.Errorf("哈希记录不存在")
}

// ProcessRefund 处理退货
func (ls *LotteryService) ProcessRefund(lotteryPoolId uint, orderId string) error {
	err := ls.repo.RefundUserHash(lotteryPoolId, orderId)
	if err != nil {
		return fmt.Errorf("退货失败: %v", err)
	}

	return nil
}

// ConductDraw 执行开奖
func (ls *LotteryService) ConductDraw(productID uint, blockHash string) (*models.DrawResult, error) {
	pool, exists := ls.pools[productID]
	if !exists {
		return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if pool.CurrentSales < pool.TargetSales {
		return nil, fmt.Errorf("销量未达到开奖条件 (%d/%d)", pool.CurrentSales, pool.TargetSales)
	}

	// 从数据库查询该奖池的所有有效用户哈希记录
	dbHashes, err := ls.repo.GetUserHashesByLotteryPoolID(pool.LotteryPoolID)
	if err != nil {
		return nil, fmt.Errorf("查询有效参与者失败: %v", err)
	}

	if len(dbHashes) == 0 {
		return nil, fmt.Errorf("没有有效的参与者")
	}

	// 计算每个用户的得分
	type ScoreEntry struct {
		UserID    string
		TxHash    string
		Score     int
		OrderTime time.Time
	}

	var scores []ScoreEntry
	for _, hash := range dbHashes {
		score := ls.calculateScore(hash.TxHash, blockHash)
		scores = append(scores, ScoreEntry{
			UserID:    hash.UserID,
			TxHash:    hash.TxHash,
			Score:     score,
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
		LotteryPoolID: pool.LotteryPoolID,
		ProductID:     productID,
		BlockHash:     blockHash,
		WinnerHash:    winner.TxHash,
		WinnerUserID:  winner.UserID,
		WinnerScore:   winner.Score,
		PoolAmount:    pool.PoolAmount,
		DrawTime:      time.Now(),
	}

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

// GetDrawHistory 获取开奖历史
func (ls *LotteryService) GetDrawHistory(productID uint) []models.DrawResult {
	var results []models.DrawResult
	for _, result := range ls.drawResults {
		if productID == 0 || result.ProductID == productID {
			results = append(results, result)
		}
	}
	return results
}

// GetPool 获取奖池
func (ls *LotteryService) GetPool(productID uint) *models.LotteryPool {
	if pool, exists := ls.pools[productID]; exists {
		return pool
	}
	return nil
}

// 获取用户参与的抽奖奖池信息及内容
func (ls *LotteryService) GetUserLotteryList(userID string) ([]entities.UserHash, error) {
	lotteryPools, err := ls.repo.GetAllValidUserHashes(userID)
	if err != nil {
		return nil, fmt.Errorf("获取用户参与的抽奖奖池信息及内容失败: %v", err)
	}

	return lotteryPools, nil
}
