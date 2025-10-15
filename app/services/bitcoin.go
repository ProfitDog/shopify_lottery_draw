package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// BitcoinService 比特币服务
type BitcoinService struct {
	baseURL string
	client  *http.Client
}

// BitcoinBlock 比特币区块信息
type BitcoinBlock struct {
	Hash   string `json:"hash"`
	Height int64  `json:"height"`
	Time   int64  `json:"time"`
}

// BitcoinResponse 比特币API响应
type BitcoinResponse struct {
	Blocks []BitcoinBlock `json:"blocks"`
}

// NewBitcoinService 创建比特币服务
func NewBitcoinService() *BitcoinService {
	return &BitcoinService{
		baseURL: "https://blockstream.info/api",
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// GetLatestBlockHash 获取最新区块哈希
func (bs *BitcoinService) GetLatestBlockHash() (string, error) {
	url := fmt.Sprintf("%s/blocks", bs.baseURL)

	resp, err := bs.client.Get(url)
	if err != nil {
		return "", fmt.Errorf("获取区块信息失败: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API请求失败，状态码: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应失败: %v", err)
	}

	var blocks []BitcoinBlock
	if err := json.Unmarshal(body, &blocks); err != nil {
		return "", fmt.Errorf("解析JSON失败: %v", err)
	}

	if len(blocks) == 0 {
		return "", fmt.Errorf("没有获取到区块信息")
	}

	return blocks[0].Hash, nil
}

// GetBlockHashAtTime 获取指定时间后的第一个区块哈希
func (bs *BitcoinService) GetBlockHashAtTime(targetTime time.Time) (string, error) {
	// 获取指定时间戳
	timestamp := targetTime.Unix()

	// 获取区块列表
	url := fmt.Sprintf("%s/blocks", bs.baseURL)

	resp, err := bs.client.Get(url)
	if err != nil {
		return "", fmt.Errorf("获取区块信息失败: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API请求失败，状态码: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应失败: %v", err)
	}

	var blocks []BitcoinBlock
	if err := json.Unmarshal(body, &blocks); err != nil {
		return "", fmt.Errorf("解析JSON失败: %v", err)
	}

	// 查找目标时间后的第一个区块
	for _, block := range blocks {
		if block.Time >= timestamp {
			return block.Hash, nil
		}
	}

	// 如果没有找到符合条件的区块，返回最新的区块哈希
	if len(blocks) > 0 {
		return blocks[0].Hash, nil
	}

	return "", fmt.Errorf("没有找到符合条件的区块")
}

// GetBlockByHash 根据哈希获取区块信息
func (bs *BitcoinService) GetBlockByHash(hash string) (*BitcoinBlock, error) {
	url := fmt.Sprintf("%s/block/%s", bs.baseURL, hash)

	resp, err := bs.client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("获取区块信息失败: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API请求失败，状态码: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	var block BitcoinBlock
	if err := json.Unmarshal(body, &block); err != nil {
		return nil, fmt.Errorf("解析JSON失败: %v", err)
	}

	return &block, nil
}

// ValidateHash 验证哈希格式
func (bs *BitcoinService) ValidateHash(hash string) bool {
	// 比特币哈希通常是64位十六进制字符串
	if len(hash) != 64 {
		return false
	}

	for _, char := range hash {
		if !((char >= '0' && char <= '9') ||
			(char >= 'a' && char <= 'f') ||
			(char >= 'A' && char <= 'F')) {
			return false
		}
	}

	return true
}
