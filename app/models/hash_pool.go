package models

import (
	"slices"
	"sync"
)

// HashPool 全局哈希池（固定大小，不删除元素）
type HashPool struct {
	hashes       []string     // 固定的哈希数组（最多1000个）
	currentIndex int          // 当前索引（自增）
	mu           sync.RWMutex // 读写锁
}

// NewHashPool 创建新的哈希池
func NewHashPool() *HashPool {
	return &HashPool{
		hashes: make([]string, 0, 1000),
	}
}

// Set 设置哈希池的内容（替换全部）
func (p *HashPool) Set(hashes []string) {
	p.mu.Lock()
	defer p.mu.Unlock()

	// 限制最多1000个
	if len(hashes) > 1000 {
		p.hashes = hashes[:1000]
	} else {
		p.hashes = hashes
	}
	// 重置索引
	p.currentIndex = 0
}

// Get 获取指定索引的哈希（不删除）
func (p *HashPool) Get(index int) (string, bool) {
	p.mu.RLock()
	defer p.mu.RUnlock()

	if index < 0 || index >= len(p.hashes) {
		return "", false
	}
	return p.hashes[index], true
}

// Len 获取哈希数量
func (p *HashPool) Len() int {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return len(p.hashes)
}

// GetAll 获取所有哈希（用于调试）
func (p *HashPool) GetAll() []string {
	p.mu.RLock()
	defer p.mu.RUnlock()

	result := make([]string, len(p.hashes))
	copy(result, p.hashes)
	return result
}

// GetNext 获取下一个哈希（自增索引）
func (p *HashPool) GetNext(poolHashes []string) (string, bool) {
	p.mu.Lock()
	defer p.mu.Unlock()

	for i := 0; i < len(p.hashes); i++ {
		if !slices.Contains(poolHashes, p.hashes[p.currentIndex]) {
			hash := p.hashes[p.currentIndex]
			p.currentIndex++
			return hash, true
		}

		p.currentIndex++
	}
	return "", false
}
