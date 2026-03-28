package service

import (
	"testing"
)

func TestParseRankSpec_Single(t *testing.T) {
	ranks, err := ParseRankSpec("1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 1 || ranks[0] != 1 {
		t.Fatalf("expected [1], got %v", ranks)
	}
}

func TestParseRankSpec_SingleLarge(t *testing.T) {
	ranks, err := ParseRankSpec("8")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 1 || ranks[0] != 8 {
		t.Fatalf("expected [8], got %v", ranks)
	}
}

func TestParseRankSpec_Multiple(t *testing.T) {
	ranks, err := ParseRankSpec("1,3")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 2 || ranks[0] != 1 || ranks[1] != 3 {
		t.Fatalf("expected [1, 3], got %v", ranks)
	}
}

func TestParseRankSpec_MultipleWithSpaces(t *testing.T) {
	ranks, err := ParseRankSpec(" 1 , 3 , 5 ")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 3 || ranks[0] != 1 || ranks[1] != 3 || ranks[2] != 5 {
		t.Fatalf("expected [1, 3, 5], got %v", ranks)
	}
}

func TestParseRankSpec_MultipleDeduplicate(t *testing.T) {
	ranks, err := ParseRankSpec("1,1,3")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 2 || ranks[0] != 1 || ranks[1] != 3 {
		t.Fatalf("expected [1, 3], got %v", ranks)
	}
}

func TestParseRankSpec_Range(t *testing.T) {
	ranks, err := ParseRankSpec("1-4")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	expected := []int{1, 2, 3, 4}
	if len(ranks) != len(expected) {
		t.Fatalf("expected %v, got %v", expected, ranks)
	}
	for i, r := range ranks {
		if r != expected[i] {
			t.Fatalf("expected %v, got %v", expected, ranks)
		}
	}
}

func TestParseRankSpec_RangeSingleElement(t *testing.T) {
	ranks, err := ParseRankSpec("3-3")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(ranks) != 1 || ranks[0] != 3 {
		t.Fatalf("expected [3], got %v", ranks)
	}
}

func TestParseRankSpec_ErrorEmpty(t *testing.T) {
	_, err := ParseRankSpec("")
	if err == nil {
		t.Fatal("expected error for empty spec")
	}
}

func TestParseRankSpec_ErrorWhitespace(t *testing.T) {
	_, err := ParseRankSpec("   ")
	if err == nil {
		t.Fatal("expected error for whitespace-only spec")
	}
}

func TestParseRankSpec_ErrorZero(t *testing.T) {
	_, err := ParseRankSpec("0")
	if err == nil {
		t.Fatal("expected error for rank 0")
	}
}

func TestParseRankSpec_ErrorNegative(t *testing.T) {
	_, err := ParseRankSpec("-1")
	if err == nil {
		t.Fatal("expected error for negative rank")
	}
}

func TestParseRankSpec_ErrorNonNumeric(t *testing.T) {
	_, err := ParseRankSpec("abc")
	if err == nil {
		t.Fatal("expected error for non-numeric spec")
	}
}

func TestParseRankSpec_ErrorRangeReversed(t *testing.T) {
	_, err := ParseRankSpec("4-1")
	if err == nil {
		t.Fatal("expected error for reversed range")
	}
}

func TestParseRankSpec_ErrorInvalidComma(t *testing.T) {
	_, err := ParseRankSpec("1,abc")
	if err == nil {
		t.Fatal("expected error for invalid comma-separated value")
	}
}

func TestCountRanksFromSpec(t *testing.T) {
	tests := []struct {
		spec     string
		expected int
	}{
		{"1", 1},
		{"1,3", 2},
		{"1-4", 4},
		{"2-2", 1},
		{"1,2,3", 3},
	}
	for _, tt := range tests {
		cnt, err := CountRanksFromSpec(tt.spec)
		if err != nil {
			t.Fatalf("CountRanksFromSpec(%q): unexpected error: %v", tt.spec, err)
		}
		if cnt != tt.expected {
			t.Fatalf("CountRanksFromSpec(%q): expected %d, got %d", tt.spec, tt.expected, cnt)
		}
	}
}

func TestCountRanksFromSpec_Error(t *testing.T) {
	_, err := CountRanksFromSpec("")
	if err == nil {
		t.Fatal("expected error for empty spec")
	}
}

func TestIsSingleRank(t *testing.T) {
	tests := []struct {
		spec     string
		expected bool
	}{
		{"1", true},
		{"5", true},
		{"1,3", false},
		{"1-4", false},
		{"3-3", true},
		{"", false},
		{"abc", false},
	}
	for _, tt := range tests {
		result := IsSingleRank(tt.spec)
		if result != tt.expected {
			t.Fatalf("IsSingleRank(%q): expected %v, got %v", tt.spec, tt.expected, result)
		}
	}
}
