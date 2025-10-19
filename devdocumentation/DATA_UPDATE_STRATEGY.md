# 奖池数据更新策略

## 背景

在抽奖系统中，每个奖池需要维护以下关键数据：
- **已售份数** (`current_sales`): 当前已卖出多少份
- **累计金额** (`pool_amount`): 奖池已累计的总金额

前端需要频繁查询这些数据以展示给用户，同时每个订单处理时都需要更新这些数据。

## 核心问题

**每个订单处理时，应该采用哪种策略更新奖池数据？**

### 方案对比

#### 方案1：增量更新（每个订单更新数据库）

**流程：**
```
订单到达 → 创建订单记录 → 更新 product_pools 表的 current_sales 和 pool_amount
```

**优点：**
- ✅ 查询性能极佳：前端直接读取字段，无需计算
- ✅ 前端响应快：适合高频查询场景
- ✅ 数据库查询压力小：简单的索引查找

**缺点：**
- ❌ 并发控制复杂：多个订单同时到达需要处理并发更新
- ❌ 数据一致性风险：订单创建成功但奖池更新失败会导致数据不一致
- ❌ 退款场景麻烦：需要回滚金额和计数，容易出错
- ❌ 需要数据库事务：确保订单和奖池更新的原子性

---

#### 方案2：实时计算（每次查询时统计）

**流程：**
```
前端查询 → SELECT COUNT(*), SUM(profit) FROM user_hash WHERE lottery_pool_id = ? AND is_valid = true
```

**优点：**
- ✅ 数据绝对准确：单一数据源（user_hash表），不会不一致
- ✅ 退款自动处理：只需标记订单状态，统计时自动排除
- ✅ 逻辑简单：不需要维护额外状态
- ✅ 无并发冲突：只有读操作，没有更新竞争

**缺点：**
- ❌ 每次查询都要聚合：虽然只有1000条记录，但比直接读字段慢
- ❌ 高频查询压力：如果前端频繁刷新，数据库压力大
- ❌ 稍慢：查询延迟约 5-10ms

---

## 推荐方案：混合策略（内存缓存 + 数据库存储 + 定期校验）

### 架构设计

```
┌─────────────┐
│   前端请求   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  读取内存缓存    │ ◄── 性能最优（<1ms）
│  ls.pools[id]   │
└─────────────────┘
       │
       │ 内存不存在时
       ▼
┌─────────────────┐
│ 读取数据库表     │ ◄── 服务重启后的备份
│ product_pools   │
└─────────────────┘
       │
       │ 数据库为空时
       ▼
┌─────────────────┐
│ 实时统计订单表   │ ◄── 最终的数据源
│   user_hash     │
└─────────────────┘
```

### 实现细节

#### 1. 写流程（ProcessOrder）

```go
func (ls *LotteryService) ProcessOrder(...) {
    // 1. 创建订单记录
    err := ls.repo.CreateUserHash(&entities.UserHash{...})
    
    // 2. 更新内存中的计数和金额
    ls.mu.Lock()
    pool := ls.pools[productID]
    pool.CurrentSales++
    pool.PoolAmount += profit
    ls.mu.Unlock()
    
    // 3. 异步持久化到数据库（可选：每10次订单或每分钟同步一次）
    // 或者在开奖时统一持久化
}
```

#### 2. 读流程（前端查询）

```go
func (ls *LotteryService) GetPoolInfo(productID int) (*models.ProductPool, error) {
    // 优先读内存
    ls.mu.RLock()
    pool, exists := ls.pools[productID]
    ls.mu.RUnlock()
    
    if exists {
        return pool, nil
    }
    
    // 内存不存在，读数据库
    pool, err := ls.repo.GetProductPool(productID)
    if err == nil && pool != nil {
        ls.mu.Lock()
        ls.pools[productID] = pool
        ls.mu.Unlock()
        return pool, nil
    }
    
    // 数据库也没有，实时统计
    return ls.calculatePoolFromOrders(productID)
}
```

#### 3. 退款流程

```go
func (ls *LotteryService) ProcessRefund(orderID string) error {
    // 1. 标记订单为无效
    err := ls.repo.InvalidateUserHash(orderID)
    
    // 2. 减少内存计数和金额
    ls.mu.Lock()
    pool := ls.pools[productID]
    pool.CurrentSales--
    pool.PoolAmount -= profit
    ls.mu.Unlock()
    
    // 3. 同步到数据库
    return ls.syncPoolToDatabase(productID)
}
```

#### 4. 定期校验机制

```go
// 每小时或每次开奖后执行
func (ls *LotteryService) ValidatePoolData(productID int) error {
    // 从订单表统计真实数据
    realData, err := ls.calculatePoolFromOrders(productID)
    
    // 与内存数据对比
    memoryData := ls.pools[productID]
    
    if realData.CurrentSales != memoryData.CurrentSales ||
       realData.PoolAmount != memoryData.PoolAmount {
        // 发现差异，记录日志
        log.Errorf("奖池数据不一致 [ProductID=%d] Memory: %+v, Real: %+v",
            productID, memoryData, realData)
        
        // 自动修正
        ls.mu.Lock()
        ls.pools[productID] = realData
        ls.mu.Unlock()
        
        // 持久化到数据库
        return ls.syncPoolToDatabase(productID)
    }
    
    return nil
}
```

#### 5. 持久化策略

**时机选择：**

| 时机 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| 每个订单后 | 数据最新 | 数据库写入频繁 | ⭐⭐ |
| 每N个订单 | 平衡性能和准确性 | 需要计数器 | ⭐⭐⭐⭐ |
| 定时（每分钟） | 减少写入频率 | 可能有延迟 | ⭐⭐⭐⭐ |
| 开奖前强制同步 | 关键时刻保证准确 | 平时可能不同步 | ⭐⭐⭐⭐⭐ |
| 服务关闭时 | 最少写入 | 异常退出会丢失 | ⭐⭐ |

**推荐组合：**
- 主策略：每10个订单或每分钟同步一次
- 保障策略：开奖前强制校验 + 同步
- 恢复策略：服务启动时从数据库加载，如果数据库为空则统计 user_hash 表

### 性能对比

假设前端每秒100次查询：

| 方案 | 查询延迟 | 数据库QPS | 数据准确性 | 实现复杂度 |
|------|---------|-----------|-----------|-----------|
| 方案1（增量更新） | ~1ms | 100 读 + 每订单 1 写 | ⚠️ 中等 | 🔴 高 |
| 方案2（实时计算） | ~10ms | 100 读（聚合查询） | ✅ 高 | 🟢 低 |
| **混合方案** | **<0.1ms** | **0 读（走内存）+ 低频写** | ✅ **高** | 🟡 **中** |

### 数据一致性保证

#### 三层防护

1. **内存层（实时）**
   - 使用 `sync.RWMutex` 保证并发安全
   - 所有读写操作都加锁

2. **数据库层（备份）**
   - 定期同步内存数据到 `product_pools` 表
   - 服务重启时的数据恢复点

3. **订单层（源头）**
   - `user_hash` 表是唯一真实数据源
   - 定期校验时以此为准

#### 一致性检查流程

```
┌────────────────┐
│  接收订单请求   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ 写入 user_hash │ ◄── Step 1: 持久化到数据库
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  更新内存计数   │ ◄── Step 2: 更新内存（失败可重试）
└────────┬───────┘
         │
         ▼
┌────────────────┐
│   返回成功     │
└────────────────┘

每小时执行：
┌────────────────┐
│ 统计 user_hash │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  对比内存数据   │
└────────┬───────┘
         │
         ▼ (发现差异)
┌────────────────┐
│   自动修正     │
└────────────────┘
```

## 实现优先级

### Phase 1: 基础版本（快速上线）
- [x] 内存维护 `ls.pools`
- [ ] 订单处理时更新内存计数
- [ ] 前端查询走内存
- [ ] 开奖后持久化到数据库

### Phase 2: 完善版本（提高可靠性）
- [ ] 实现定期同步机制（每分钟）
- [ ] 服务启动时从数据库加载
- [ ] 添加退款处理逻辑

### Phase 3: 生产版本（保证一致性）
- [ ] 实现定期校验机制（每小时）
- [ ] 开奖前强制校验
- [ ] 差异告警和自动修正
- [ ] 监控指标上报

## 关键代码位置

- **内存结构**: `app/services/lottery.go` - `LotteryService.pools`
- **订单处理**: `app/services/lottery.go` - `ProcessOrder()`
- **数据库操作**: `app/repositories/lottery_repository.go`
- **实体定义**: `app/entities/product_pool.go`

## 注意事项

1. **并发安全**：所有内存操作必须加锁（`sync.RWMutex`）
2. **退款处理**：不要删除 `user_hash` 记录，只标记 `is_valid = false`
3. **开奖前校验**：关键操作前必须强制校验数据一致性
4. **异常恢复**：服务重启时优先从数据库加载，数据库为空则统计订单表
5. **监控告警**：定期校验发现差异时要记录日志并告警

## 未来优化

1. **Redis 缓存**：如果有多个服务实例，考虑使用 Redis 替代内存缓存
2. **消息队列**：使用 MQ 异步处理订单，避免高峰期阻塞
3. **读写分离**：查询走从库，减少主库压力
4. **分布式锁**：多实例部署时使用 Redis 分布式锁保证并发安全

