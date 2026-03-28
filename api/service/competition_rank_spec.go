package service

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// ParseRankSpec は rank_spec 文字列をパースして対象順位のスライスを返す。
// サポートするパターン:
//   - 単体: "1"
//   - 複数: "1,3"
//   - 幅:   "1-4"
func ParseRankSpec(spec string) ([]int, error) {
	spec = strings.TrimSpace(spec)
	if spec == "" {
		return nil, fmt.Errorf("rank_spec is empty")
	}

	// 幅指定: "1-4"
	if strings.Contains(spec, "-") {
		parts := strings.SplitN(spec, "-", 2)
		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid range format: %s", spec)
		}
		start, err := strconv.Atoi(strings.TrimSpace(parts[0]))
		if err != nil || start < 1 {
			return nil, fmt.Errorf("invalid range start: %s", parts[0])
		}
		end, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil || end < 1 {
			return nil, fmt.Errorf("invalid range end: %s", parts[1])
		}
		if start > end {
			return nil, fmt.Errorf("range start %d > end %d", start, end)
		}
		ranks := make([]int, 0, end-start+1)
		for i := start; i <= end; i++ {
			ranks = append(ranks, i)
		}
		return ranks, nil
	}

	// 複数指定 or 単体: "1,3" or "1"
	parts := strings.Split(spec, ",")
	ranks := make([]int, 0, len(parts))
	seen := make(map[int]bool)
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		r, err := strconv.Atoi(p)
		if err != nil || r < 1 {
			return nil, fmt.Errorf("invalid rank: %s", p)
		}
		if seen[r] {
			continue
		}
		seen[r] = true
		ranks = append(ranks, r)
	}
	if len(ranks) == 0 {
		return nil, fmt.Errorf("no valid ranks in spec: %s", spec)
	}
	sort.Ints(ranks)
	return ranks, nil
}

// CountRanksFromSpec は rank_spec から進出チーム数を算出する。
func CountRanksFromSpec(spec string) (int, error) {
	ranks, err := ParseRankSpec(spec)
	if err != nil {
		return 0, err
	}
	return len(ranks), nil
}

// IsSingleRank は rank_spec が単体指定かどうかを判定する。
func IsSingleRank(spec string) bool {
	ranks, err := ParseRankSpec(spec)
	if err != nil {
		return false
	}
	return len(ranks) == 1
}
