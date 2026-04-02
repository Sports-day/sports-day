package authz

import (
	"sync"
	"time"
)

const roleCacheTTL = 60 * time.Second

// roleCacheEntry はキャッシュエントリを表す。
type roleCacheEntry struct {
	role   string
	expiry time.Time
}

// RoleCache は sub → role のインメモリキャッシュ（TTL 60秒）。
// sync.RWMutex で並行安全を確保している。
type RoleCache struct {
	mu    sync.RWMutex
	cache map[string]roleCacheEntry
}

// NewRoleCache は RoleCache を初期化して返す。
func NewRoleCache() *RoleCache {
	return &RoleCache{
		cache: make(map[string]roleCacheEntry),
	}
}

// Get は指定 sub のロールをキャッシュから取得する。
// キャッシュが有効な場合はロール文字列と true を返す。
// キャッシュ MISS または TTL 切れの場合は空文字列と false を返す。
func (c *RoleCache) Get(sub string) (string, bool) {
	c.mu.RLock()
	entry, ok := c.cache[sub]
	c.mu.RUnlock()

	if !ok {
		return "", false
	}
	if time.Now().After(entry.expiry) {
		// TTL 切れ → 削除して MISS 扱い
		c.Delete(sub)
		return "", false
	}
	return entry.role, true
}

// Set は指定 sub のロールをキャッシュに保存する（TTL 60秒）。
func (c *RoleCache) Set(sub string, role string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.cache[sub] = roleCacheEntry{
		role:   role,
		expiry: time.Now().Add(roleCacheTTL),
	}
}

// Delete は指定 sub のキャッシュを即時削除する。
// ロール変更時に即時無効化するために使用する。
func (c *RoleCache) Delete(sub string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.cache, sub)
}
