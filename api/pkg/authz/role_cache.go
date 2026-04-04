package authz

import (
	"sync"
	"time"
)

// roleCacheEntry はキャッシュエントリを表す。
type roleCacheEntry struct {
	role   string
	expiry time.Time
}

// RoleCache は userID → role のインメモリキャッシュ。
// sync.RWMutex で並行安全を確保している。
type RoleCache struct {
	mu    sync.RWMutex
	ttl   time.Duration
	cache map[string]roleCacheEntry
}

// NewRoleCache は RoleCache を初期化して返す。ttlSeconds でキャッシュの有効期間（秒）を指定する。
func NewRoleCache(ttlSeconds int) *RoleCache {
	return &RoleCache{
		ttl:   time.Duration(ttlSeconds) * time.Second,
		cache: make(map[string]roleCacheEntry),
	}
}

// Get は指定 userID のロールをキャッシュから取得する。
// キャッシュが有効な場合はロール文字列と true を返す。
// キャッシュ MISS または TTL 切れの場合は空文字列と false を返す。
func (c *RoleCache) Get(userID string) (string, bool) {
	c.mu.RLock()
	entry, ok := c.cache[userID]
	c.mu.RUnlock()

	if !ok {
		return "", false
	}
	if time.Now().After(entry.expiry) {
		// TTL 切れ → 削除して MISS 扱い
		c.Delete(userID)
		return "", false
	}
	return entry.role, true
}

// Set は指定 userID のロールをキャッシュに保存する（TTL 60秒）。
func (c *RoleCache) Set(userID string, role string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.cache[userID] = roleCacheEntry{
		role:   role,
		expiry: time.Now().Add(c.ttl),
	}
}

// Delete は指定 userID のキャッシュを即時削除する。
// ロール変更時に即時無効化するために使用する。
func (c *RoleCache) Delete(userID string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.cache, userID)
}
