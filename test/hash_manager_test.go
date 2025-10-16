package test

import (
	"fmt"
	"shopify_lottery_draw/app/services"
	"sync"
	"testing"
)

// TestHashManager_PreloadAndGet 测试预加载和获取哈希
// 流程: 预加载哈希到全局池 → 为lottery pool获取哈希 → 验证同一lottery pool内哈希不重复
func TestHashManager_PreloadAndGet(t *testing.T) {
	manager := services.GetHashManager()

	// 预加载一些哈希到全局池（模拟5000个，分配到5个池）
	var testHashes []string
	for i := 0; i < 5000; i++ {
		testHashes = append(testHashes, fmt.Sprintf("hash_%d", i))
	}
	manager.PreloadGlobalPools(testHashes)

	// 检查全局池状态
	status := manager.GetGlobalPoolsStatus()
	totalHashes := status["total_hashes"].(int)
	if totalHashes != 5000 {
		t.Errorf("预期全局池总哈希数量为5000，实际为%d", totalHashes)
	}

	// 为lottery pool 1获取哈希
	hash1, err := manager.GetHashForPool(1)
	if err != nil {
		t.Errorf("获取哈希失败: %v", err)
	}
	if hash1 == "" {
		t.Error("获取的哈希不应该为空")
	}

	// 再次为lottery pool 1获取哈希，应该不重复
	hash2, err := manager.GetHashForPool(1)
	if err != nil {
		t.Errorf("获取第二个哈希失败: %v", err)
	}
	if hash1 == hash2 {
		t.Error("同一lottery pool不应该获取到相同的哈希")
	}

	// 验证lottery pool 1的使用记录
	usage := manager.GetLotteryPoolUsage(1)
	if usage != 2 {
		t.Errorf("预期lottery pool 1使用了2个哈希，实际为%d", usage)
	}

	t.Logf("Lottery pool 1获取的哈希: %s, %s", hash1, hash2)
}

// TestHashManager_MultiPoolIsolation 测试多lottery pool隔离
// 流程: 预加载哈希 → lottery pool1和2都获取哈希 → 验证可以获取相同哈希（因为不同lottery pool间不隔离）
func TestHashManager_MultiPoolIsolation(t *testing.T) {
	manager := services.GetHashManager()

	// 预加载哈希（5000个）
	var testHashes []string
	for i := 0; i < 5000; i++ {
		testHashes = append(testHashes, fmt.Sprintf("shared_hash_%d", i))
	}
	manager.PreloadGlobalPools(testHashes)

	// lottery pool 201获取哈希
	hash1, err := manager.GetHashForPool(201)
	if err != nil {
		t.Errorf("lottery pool 201获取哈希失败: %v", err)
	}

	// lottery pool 202获取哈希（可能获取到相同的哈希，因为不同lottery pool）
	hash2, err := manager.GetHashForPool(202)
	if err != nil {
		t.Errorf("lottery pool 202获取哈希失败: %v", err)
	}

	// 两个不同lottery pool可以使用相同的哈希
	t.Logf("Lottery pool 201获取: %s, Lottery pool 202获取: %s", hash1, hash2)

	// 验证使用记录
	usage1 := manager.GetLotteryPoolUsage(201)
	usage2 := manager.GetLotteryPoolUsage(202)
	if usage1 != 1 {
		t.Errorf("预期lottery pool 201使用了1个哈希，实际为%d", usage1)
	}
	if usage2 != 1 {
		t.Errorf("预期lottery pool 202使用了1个哈希，实际为%d", usage2)
	}
}

// TestHashManager_ConcurrentAccess 测试并发安全性
// 流程: 预加载5000个哈希 → 启动100个goroutine并发为同一lottery pool获取 → 验证无重复
func TestHashManager_ConcurrentAccess(t *testing.T) {
	manager := services.GetHashManager()
	lotteryPoolID := 300

	// 预加载足够的哈希（5000个）
	var hashes []string
	for i := 0; i < 5000; i++ {
		hashes = append(hashes, fmt.Sprintf("concurrent_hash_%d", i))
	}
	manager.PreloadGlobalPools(hashes)

	// 并发获取哈希
	numGoroutines := 100
	var wg sync.WaitGroup
	results := make(chan string, numGoroutines)

	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			hash, err := manager.GetHashForPool(lotteryPoolID)
			if err == nil && hash != "" {
				results <- hash
			}
		}()
	}
	wg.Wait()
	close(results)

	// 收集结果并验证唯一性（同一lottery pool内不重复）
	retrieved := make(map[string]bool)
	for hash := range results {
		if retrieved[hash] {
			t.Errorf("并发获取到重复哈希: %s", hash)
		}
		retrieved[hash] = true
	}

	if len(retrieved) != numGoroutines {
		t.Errorf("预期获取%d个唯一哈希，实际获取%d个", numGoroutines, len(retrieved))
	}

	// 验证使用记录
	usage := manager.GetLotteryPoolUsage(lotteryPoolID)
	if usage != numGoroutines {
		t.Errorf("预期lottery pool %d使用了%d个哈希，实际为%d", lotteryPoolID, numGoroutines, usage)
	}
}

// TestHashManager_SameHashDifferentPools 测试相同哈希可被不同lottery pool使用
// 流程: 预加载5000个哈希 → 两个lottery pool都获取 → 验证可以获取到相同哈希
func TestHashManager_SameHashDifferentPools(t *testing.T) {
	manager := services.GetHashManager()

	// 预加载5000个哈希
	var testHashes []string
	for i := 0; i < 5000; i++ {
		testHashes = append(testHashes, fmt.Sprintf("reusable_hash_%d", i))
	}
	manager.PreloadGlobalPools(testHashes)

	// lottery pool 401获取10个哈希
	var pool401Hashes []string
	for i := 0; i < 10; i++ {
		hash, _ := manager.GetHashForPool(401)
		pool401Hashes = append(pool401Hashes, hash)
	}

	// lottery pool 402也获取10个哈希
	var pool402Hashes []string
	for i := 0; i < 10; i++ {
		hash, _ := manager.GetHashForPool(402)
		pool402Hashes = append(pool402Hashes, hash)
	}

	t.Logf("Lottery pool 401前3个: %v", pool401Hashes[:3])
	t.Logf("Lottery pool 402前3个: %v", pool402Hashes[:3])

	// 两个lottery pool应该可以使用相同的哈希（因为全局池的哈希可以被重复使用）
	// 验证各自的使用记录
	usage1 := manager.GetLotteryPoolUsage(401)
	usage2 := manager.GetLotteryPoolUsage(402)

	if usage1 != 10 {
		t.Errorf("预期lottery pool 401使用了10个哈希，实际为%d", usage1)
	}
	if usage2 != 10 {
		t.Errorf("预期lottery pool 402使用了10个哈希，实际为%d", usage2)
	}

	// 验证两个池可能有相同的哈希（理论上可能，但本例中由于遍历顺序应该相同）
	sameHashFound := false
	for _, h1 := range pool401Hashes {
		for _, h2 := range pool402Hashes {
			if h1 == h2 {
				sameHashFound = true
				t.Logf("找到相同哈希: %s 在两个lottery pool中都被使用", h1)
				break
			}
		}
	}
	if !sameHashFound {
		t.Log("两个lottery pool获取的哈希完全不同（预期：可能相同）")
	}
}

// TestHashManager_GetBlockTransactions 测试从区块链获取交易哈希
// 流程: 调用真实API获取指定区块的交易 → 验证返回数据
func TestHashManager_GetBlockTransactions(t *testing.T) {
	manager := services.GetHashManager()
	hashes, err := manager.GetBlockTransactions(919312)
	if err != nil {
		t.Errorf("获取区块交易失败: %v", err)
	}
	if len(hashes) == 0 {
		t.Error("获取到的区块交易为空")
	}
	t.Logf("获取到的哈希数量: %d", len(hashes))
	if len(hashes) >= 5 {
		t.Logf("前5个哈希: %v", hashes[:5])
	}
}

// TestHashManager_RefreshGlobalPools 测试刷新全局哈希池
// 流程: 调用RefreshGlobalPools → 验证全局池被填充
func TestHashManager_RefreshGlobalPools(t *testing.T) {
	t.Skip("跳过真实API调用测试，避免网络依赖")

	manager := services.GetHashManager()
	err := manager.RefreshGlobalPools()
	if err != nil {
		t.Errorf("刷新全局池失败: %v", err)
	}

	// 检查全局池状态
	status := manager.GetGlobalPoolsStatus()
	totalHashes := status["total_hashes"].(int)
	if totalHashes == 0 {
		t.Error("刷新后全局池应该包含哈希")
	}
	t.Logf("刷新后全局池总哈希数: %d", totalHashes)
	t.Logf("各池状态: %v", status["pool_status"])
}
