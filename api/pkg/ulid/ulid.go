package ulid

import (
	"math/rand"
	"sync"
	"time"

	"sports-day/api/pkg/errors"

	"github.com/oklog/ulid/v2"
)

var (
	mu      sync.Mutex
	entropy = ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), 0)
)

func Make() string {
	mu.Lock()
	defer mu.Unlock()
	id, err := ulid.New(ulid.Now(), entropy)
	if err != nil {
		// エントロピー枯渇時はソースをリセットして再生成
		entropy = ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), 0)
		id, err = ulid.New(ulid.Now(), entropy)
		if err != nil {
			panic("ulid: failed to generate ID after entropy reset: " + err.Error())
		}
	}
	return id.String()
}

func Valid(s string) error {
	if _, err := ulid.Parse(s); err != nil {
		return errors.Wrap(err)
	}
	return nil
}
