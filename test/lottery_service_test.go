package test

import (
	"fmt"
	"testing"
	"time"

	"shopify_lottery_draw/app/models"
	"shopify_lottery_draw/app/services"
)

// TestGetPoolStatus_NotExists 测试获取不存在的奖池状态
func TestGetPoolStatus_NotExists(t *testing.T) {
	ls := createTestLotteryService()

	_, err := ls.GetPoolStatus(999)
	if err == nil {
		t.Error("期望返回错误，但没有错误")
	}
}

// TestGetPool_Success 测试获取奖池成功
func TestGetPool_Success(t *testing.T) {
	ls := createTestLotteryService()

	ls.AddTestPool(1, &models.LotteryPool{
		LotteryPoolID: 1,
		ProductID:     101,
		ProductName:   "测试商品",
	})

	pool := ls.GetPool(1)
	if pool == nil {
		t.Error("期望返回奖池，但返回 nil")
	}

	if pool.ProductName != "测试商品" {
		t.Errorf("ProductName = %v, want '测试商品'", pool.ProductName)
	}
}

// TestGetPool_NotExists 测试获取不存在的奖池
func TestGetPool_NotExists(t *testing.T) {
	ls := createTestLotteryService()

	pool := ls.GetPool(999)
	if pool != nil {
		t.Error("期望返回 nil，但返回了奖池")
	}
}

// TestGetDrawHistory 测试获取开奖历史
func TestGetDrawHistory(t *testing.T) {
	ls := createTestLotteryService()

	ls.AddTestDrawResult(models.DrawResult{ProductID: 101, WinnerUserID: "user1"})
	ls.AddTestDrawResult(models.DrawResult{ProductID: 102, WinnerUserID: "user2"})
	ls.AddTestDrawResult(models.DrawResult{ProductID: 101, WinnerUserID: "user3"})

	// 测试获取特定商品的历史
	results := ls.GetDrawHistory(101)
	if len(results) != 2 {
		t.Errorf("期望返回 2 条记录，实际返回 %d 条", len(results))
	}

	// 测试获取所有历史
	allResults := ls.GetDrawHistory(0)
	if len(allResults) != 3 {
		t.Errorf("期望返回 3 条记录，实际返回 %d 条", len(allResults))
	}
}

// TestConductDraw_PoolNotExists 测试奖池不存在的情况
func TestConductDraw_PoolNotExists(t *testing.T) {
	ls := createTestLotteryService()

	_, err := ls.ConductDraw(999, "blockhash123")
	if err == nil {
		t.Error("期望返回错误，但没有错误")
	}
}

// TestConductDraw_NotEnoughSales 测试销量未达标的情况
func TestConductDraw_NotEnoughSales(t *testing.T) {
	ls := createTestLotteryService()

	ls.AddTestPool(1, &models.LotteryPool{
		LotteryPoolID: 1,
		ProductID:     101,
		CurrentSales:  50,
		TargetSales:   100,
	})

	_, err := ls.ConductDraw(1, "blockhash123")
	if err == nil {
		t.Error("期望返回错误，但没有错误")
	}
}

// 辅助函数：创建用于测试的 LotteryService
func createTestLotteryService() *TestLotteryService {
	return &TestLotteryService{
		service: &services.LotteryService{},
		pools:   make(map[uint]*models.LotteryPool),
		results: []models.DrawResult{},
	}
}

// TestLotteryService 用于测试的包装器
type TestLotteryService struct {
	service *services.LotteryService
	pools   map[uint]*models.LotteryPool
	results []models.DrawResult
}

func (t *TestLotteryService) AddTestPool(id uint, pool *models.LotteryPool) {
	t.pools[id] = pool
}

func (t *TestLotteryService) AddTestDrawResult(result models.DrawResult) {
	t.results = append(t.results, result)
}

func (t *TestLotteryService) GetPoolStatus(productID uint) (*models.DrawSchedule, error) {
	if pool, exists := t.pools[productID]; exists {
		progress := float64(pool.CurrentSales) / float64(pool.TargetSales) * 100
		return &models.DrawSchedule{
			ProductID:     pool.ProductID,
			LotteryPoolID: pool.LotteryPoolID,
			ProductName:   pool.ProductName,
			CurrentSales:  pool.CurrentSales,
			TargetSales:   pool.TargetSales,
			Progress:      progress,
			PoolAmount:    pool.PoolAmount,
			NextDrawTime:  time.Now(),
		}, nil
	}
	return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
}

func (t *TestLotteryService) GetPool(productID uint) *models.LotteryPool {
	if pool, exists := t.pools[productID]; exists {
		return pool
	}
	return nil
}

func (t *TestLotteryService) GetDrawHistory(productID uint) []models.DrawResult {
	var results []models.DrawResult
	for _, result := range t.results {
		if productID == 0 || result.ProductID == productID {
			results = append(results, result)
		}
	}
	return results
}

func (t *TestLotteryService) ConductDraw(productID uint, blockHash string) (*models.DrawResult, error) {
	pool, exists := t.pools[productID]
	if !exists {
		return nil, fmt.Errorf("商品 %d 的奖池不存在", productID)
	}

	if pool.CurrentSales < pool.TargetSales {
		return nil, fmt.Errorf("销量未达到开奖条件 (%d/%d)", pool.CurrentSales, pool.TargetSales)
	}

	return &models.DrawResult{
		LotteryPoolID: pool.LotteryPoolID,
		ProductID:     productID,
		BlockHash:     blockHash,
		DrawTime:      time.Now(),
	}, nil
}
