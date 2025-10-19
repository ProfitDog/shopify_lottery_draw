package services

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
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
	globalPools        [5]*models.HashPool // 全局5个哈希池（每个1000个哈希，不删除）
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
			currentBlockHeight: 917583, // 初始区块高度
		}
		// 初始化5个全局哈希池
		for i := 0; i < 5; i++ {
			hashManager.globalPools[i] = models.NewHashPool()
		}
	})
	return hashManager
}

// GetHashForPool 为lottery pool获取一个哈希（随机选择全局池）
func (m *HashManager) GetHashForPool(poolHashes []string) (string, error) {
	// 生成1~5之间的随机数（索引0~4）
	randomIdx := rand.Intn(5)

	// 从随机选中的池获取下一个哈希（内部自动加锁、索引自增）
	hash, ok := m.globalPools[randomIdx].GetNext(poolHashes)
	if ok {
		return hash, nil
	}

	// 如果该池已用完，需要刷新全局池
	return "", fmt.Errorf("全局池 %d 的哈希已用完，需要刷新全局池", randomIdx)
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
// func (m *HashManager) GetGlobalPoolsStatus() map[string]interface{} {
// 	totalRemaining := 0
// 	poolStatus := make([]map[string]int, 5)
// 	for i := 0; i < 5; i++ {
// 		total := m.globalPools[i].Len()
// 		remaining := m.globalPools[i].Len() - len(poolHashes)
// 		poolStatus[i] = map[string]int{
// 			"total":     total,
// 			"remaining": remaining,
// 			"used":      total - remaining,
// 		}
// 		totalRemaining += remaining
// 	}

// 	return map[string]interface{}{
// 		"total_remaining": totalRemaining,
// 		"pool_status":     poolStatus,
// 	}
// }
