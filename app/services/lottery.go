package services

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"shopify_lottery_draw/app/models"
	"sort"
	"time"
)

// LotteryService 抽奖服务
type LotteryService struct {
	pools              map[int]*models.ProductPool   // 商品奖池
	userHashes         map[string][]*models.UserHash // 用户哈希记录 key: userID
	drawResults        []models.DrawResult           // 开奖历史
	nextID             int                           // 下一个ID
	usedHashes         map[string]bool               // 已使用的哈希值
	currentBlockHeight int                           // 当前区块高度
}

// NewLotteryService 创建抽奖服务
func NewLotteryService() *LotteryService {
	service := &LotteryService{
		pools:              make(map[int]*models.ProductPool),
		userHashes:         make(map[string][]*models.UserHash),
		usedHashes:         make(map[string]bool),
		nextID:             1,
		currentBlockHeight: 917583, // 设置一个初始区块高度
	}

	// 初始化一些示例商品奖池
	service.initSamplePools()

	return service
}

// initSamplePools 初始化示例商品奖池
func (ls *LotteryService) initSamplePools() {
	products := []struct {
		ID      int
		Name    string
		WeekDay int
		Hour    int
	}{
		{1, "iPhone 15", 1, 20},   // 周一 20:00 UTC
		{2, "MacBook Pro", 3, 21}, // 周三 21:00 UTC
		{3, "AirPods Pro", 5, 19}, // 周五 19:00 UTC
	}

	for _, p := range products {
		ls.pools[p.ID] = &models.ProductPool{
			ProductID:   p.ID,
			ProductName: p.Name,
			TargetSales: 1000,
			IsActive:    true,
			CreatedAt:   time.Now(),
			DrawWeekDay: p.WeekDay,
			DrawHour:    p.Hour,
		}
	}
}

// CreatePool 创建商品奖池
func (ls *LotteryService) CreatePool(productID int, productName string, weekDay, hour int) error {
	if _, exists := ls.pools[productID]; exists {
		return fmt.Errorf("商品 %d 的奖池已存在", productID)
	}

	ls.pools[productID] = &models.ProductPool{
		ProductID:   productID,
		ProductName: productName,
		TargetSales: 1000,
		IsActive:    true,
		CreatedAt:   time.Now(),
		DrawWeekDay: weekDay,
		DrawHour:    hour,
	}

	return nil
}

// ProcessOrder 处理订单，分配哈希值
func (ls *LotteryService) ProcessOrder(userID, orderID string, productID int, profit float64) (*models.UserHash, error) {
	pool, exists := ls.pools[productID]
	if !exists {
		return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if !pool.IsActive {
		return nil, fmt.Errorf("商品 %d 的奖池未激活", productID)
	}

	// 通过哈希管理器获取可用的比特币交易哈希
	hashManager := GetHashManager()
	txHash, err := hashManager.GetHashForPool(productID)
	if err != nil {
		return nil, fmt.Errorf("获取比特币交易哈希失败: %v", err)
	}

	// 创建用户哈希记录
	userHash := &models.UserHash{
		ID:          ls.nextID,
		UserID:      userID,
		OrderID:     orderID,
		ProductID:   productID,
		TxHash:      txHash,
		IsValid:     true,
		ResetCount:  0,
		CreatedAt:   time.Now(),
		LastResetAt: time.Time{},
	}

	ls.nextID++

	// 添加到用户哈希记录
	if ls.userHashes[userID] == nil {
		ls.userHashes[userID] = make([]*models.UserHash, 0)
	}
	ls.userHashes[userID] = append(ls.userHashes[userID], userHash)

	// 更新奖池
	pool.CurrentSales++
	pool.PoolAmount += profit

	return userHash, nil
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

// GetAvailableHash 获取可用的比特币交易哈希
func (ls *LotteryService) GetAvailableHash() (string, error) {
	limit := 20 // 每次获取20个哈希
	offset := 0

	for {
		// 获取当前区块高度的哈希
		hashes, err := ls.GetBtcOrderHash(ls.currentBlockHeight, limit, offset)
		if err != nil {
			return "", err
		}

		// 如果没有更多哈希，尝试前一个区块
		if len(hashes) == 0 {
			ls.currentBlockHeight--
			offset = 0
			continue
		}

		// 查找未使用的哈希
		for _, hash := range hashes {
			if !ls.usedHashes[hash] {
				// 标记为已使用
				ls.usedHashes[hash] = true
				return hash, nil
			}
		}

		// 如果当前区块的所有哈希都被使用，尝试前一个区块
		ls.currentBlockHeight--
		offset = 0
	}
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

// GetBtcOrderHash 获取指定区块高度的交易哈希（支持分页）
func (ls *LotteryService) GetBtcOrderHash(blockHeight int, limit int, offset int) ([]string, error) {
	// 获取指定区块高度的交易哈希
	blockHashes, err := ls.getBlockTransactions(blockHeight)
	if err != nil {
		return nil, err
	}

	// 设置默认值
	if limit <= 0 {
		limit = 50 // 默认每次获取50个
	}
	if offset < 0 {
		offset = 0
	}

	// 计算返回范围
	start := offset
	end := offset + limit

	// 确保不超出范围
	if start >= len(blockHashes) {
		return []string{}, nil // 没有更多数据
	}
	if end > len(blockHashes) {
		end = len(blockHashes)
	}

	return blockHashes[start:end], nil
}

// getBlockTransactions 获取指定区块高度中的交易
func (ls *LotteryService) getBlockTransactions(height int) ([]string, error) {
	// 第一步：获取区块哈希
	blockURL := fmt.Sprintf("https://blockstream.info/api/block-height/%d", height)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Get(blockURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("获取区块哈希失败，状态码: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	blockHash := string(body)
	if len(blockHash) != 64 {
		return nil, fmt.Errorf("无效的区块哈希: %s", blockHash)
	}

	// 第二步：使用区块哈希获取交易列表
	txsURL := fmt.Sprintf("https://blockstream.info/api/block/%s/txs", blockHash)
	resp2, err := client.Get(txsURL)
	if err != nil {
		return nil, err
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("获取区块交易失败，状态码: %d", resp2.StatusCode)
	}

	body2, err := io.ReadAll(resp2.Body)
	if err != nil {
		return nil, err
	}

	var transactions []BitcoinTransaction
	if err := json.Unmarshal(body2, &transactions); err != nil {
		return nil, fmt.Errorf("解析交易数据失败: %v", err)
	}

	var hashes []string
	for _, tx := range transactions {
		if tx.TxID != "" {
			hashes = append(hashes, tx.TxID)
		}
	}

	return hashes, nil
}
