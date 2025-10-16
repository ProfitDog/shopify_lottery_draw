package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"shopify_lottery_draw/app/models"
	"sync"
	"time"
)

// BitcoinTransaction 比特币交易结构
type BitcoinTransaction struct {
	TxID string `json:"txid"`
}

// HashManager 哈希管理器
type HashManager struct {
	globalPools        [5]*models.HashPool     // 全局5个哈希池（每个1000个哈希，不删除）
	poolUsage          map[int]map[string]bool // 每个lottery pool的使用记录
	usageMu            sync.RWMutex            // 保护 poolUsage
	currentBlockHeight int
	blockHeightLock    sync.Mutex
}

var (
	hashManager     *HashManager
	hashManagerOnce sync.Once
)

// GetHashManager 获取哈希管理器单例
func GetHashManager() *HashManager {
	hashManagerOnce.Do(func() {
		hashManager = &HashManager{
			poolUsage:          make(map[int]map[string]bool),
			currentBlockHeight: 917583, // 初始区块高度
		}
		// 初始化5个全局哈希池
		for i := 0; i < 5; i++ {
			hashManager.globalPools[i] = models.NewHashPool()
		}
	})
	return hashManager
}

// ensurePoolUsageMap 确保奖池使用记录存在
func (m *HashManager) ensurePoolUsageMap(poolID int) {
	m.usageMu.RLock()
	_, exists := m.poolUsage[poolID]
	m.usageMu.RUnlock()

	if !exists {
		m.usageMu.Lock()
		if _, exists := m.poolUsage[poolID]; !exists {
			m.poolUsage[poolID] = make(map[string]bool)
		}
		m.usageMu.Unlock()
	}
}

// GetHashForPool 为lottery pool获取一个未使用的哈希（从全局池轮询遍历）
func (m *HashManager) GetHashForPool(lotteryPoolID int) (string, error) {
	m.ensurePoolUsageMap(lotteryPoolID)

	// 遍历5个全局池，在每个池中查找未使用的哈希
	for globalPoolIdx := 0; globalPoolIdx < 5; globalPoolIdx++ {
		globalPool := m.globalPools[globalPoolIdx]
		poolLen := globalPool.Len()

		// 如果池为空，跳过
		if poolLen == 0 {
			continue
		}

		// 遍历该全局池的所有哈希（从0到poolLen-1）
		for hashIdx := 0; hashIdx < poolLen; hashIdx++ {
			hash, ok := globalPool.Get(hashIdx)
			if !ok {
				continue
			}

			// 原子化检查和设置（避免并发竞态）
			m.usageMu.Lock()
			isUsed := m.poolUsage[lotteryPoolID][hash]
			if !isUsed {
				// 找到未使用的哈希，标记并返回
				m.poolUsage[lotteryPoolID][hash] = true
				m.usageMu.Unlock()
				return hash, nil
			}
			m.usageMu.Unlock()
		}
	}

	// 所有全局池都遍历完了，仍未找到可用哈希，说明需要刷新全局池
	return "", fmt.Errorf("所有全局池的哈希已被lottery pool %d使用，需要刷新全局池", lotteryPoolID)
}

// RefreshGlobalPools 刷新全局哈希池（获取5000个哈希，每池1000个）
func (m *HashManager) RefreshGlobalPools() error {
	m.blockHeightLock.Lock()
	defer m.blockHeightLock.Unlock()

	// 获取5000个交易哈希
	var allHashes []string
	for len(allHashes) < 5000 {
		hashes, err := m.GetBtcOrderHash(m.currentBlockHeight, 5000-len(allHashes), 0)
		if err != nil {
			return fmt.Errorf("获取区块交易失败: %v", err)
		}

		if len(hashes) == 0 {
			// 当前区块没有交易，尝试前一个区块
			m.currentBlockHeight--
			continue
		}

		allHashes = append(allHashes, hashes...)

		// 如果获取到足够的哈希，跳出循环
		if len(allHashes) >= 5000 {
			break
		}

		// 继续从前一个区块获取
		m.currentBlockHeight--
	}

	// 限制为5000个
	if len(allHashes) > 5000 {
		allHashes = allHashes[:5000]
	}

	// 分配到5个全局池，每池1000个
	for i := 0; i < 5; i++ {
		start := i * 1000
		end := start + 1000
		if end > len(allHashes) {
			end = len(allHashes)
		}
		if start < len(allHashes) {
			m.globalPools[i].Set(allHashes[start:end])
		}
	}

	return nil
}

// GetBtcOrderHash 获取指定区块高度的交易哈希
func (m *HashManager) GetBtcOrderHash(blockHeight int, limit int, offset int) ([]string, error) {
	blockHashes, err := m.GetBlockTransactions(blockHeight)
	if err != nil {
		return nil, err
	}

	if limit <= 0 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	start := offset
	end := offset + limit

	if start >= len(blockHashes) {
		return []string{}, nil
	}
	if end > len(blockHashes) {
		end = len(blockHashes)
	}

	return blockHashes[start:end], nil
}

// getBlockTransactions 获取指定区块高度中的交易
func (m *HashManager) GetBlockTransactions(height int) ([]string, error) {
	// 获取区块哈希
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

	// 使用 txids 端点获取所有交易ID
	txidsURL := fmt.Sprintf("https://blockstream.info/api/block/%s/txids", blockHash)
	resp2, err := client.Get(txidsURL)
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

	var txids []string
	if err := json.Unmarshal(body2, &txids); err != nil {
		return nil, fmt.Errorf("解析交易ID失败: %v", err)
	}

	// 限制返回数量，避免一次性加载过多
	maxTxids := 10000
	if len(txids) > maxTxids {
		txids = txids[:maxTxids]
	}

	return txids, nil
}

// PreloadGlobalPools 预加载全局哈希池（测试或启动时调用）
func (m *HashManager) PreloadGlobalPools(hashes []string) {
	// 平均分配到5个全局池，每池最多1000个
	chunkSize := 1000
	for i := 0; i < 5; i++ {
		start := i * chunkSize
		end := start + chunkSize
		if start >= len(hashes) {
			break
		}
		if end > len(hashes) {
			end = len(hashes)
		}
		m.globalPools[i].Set(hashes[start:end])
	}
}

// GetGlobalPoolsStatus 获取全局哈希池状态
func (m *HashManager) GetGlobalPoolsStatus() map[string]interface{} {
	totalCount := 0
	poolStatus := make([]int, 5)
	for i := 0; i < 5; i++ {
		count := m.globalPools[i].Len()
		poolStatus[i] = count
		totalCount += count
	}

	return map[string]interface{}{
		"total_hashes": totalCount,
		"pool_status":  poolStatus,
	}
}

// GetLotteryPoolUsage 获取指定奖池的使用记录数量
func (m *HashManager) GetLotteryPoolUsage(poolID int) int {
	m.usageMu.RLock()
	defer m.usageMu.RUnlock()

	if usage, exists := m.poolUsage[poolID]; exists {
		return len(usage)
	}
	return 0
}
