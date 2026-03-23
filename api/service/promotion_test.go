package service

import (
	"reflect"
	"testing"
)

func TestParseRankSpec(t *testing.T) {
	tests := []struct {
		name    string
		spec    string
		want    []int
		wantErr bool
	}{
		{name: "単体指定", spec: "1", want: []int{1}},
		{name: "単体指定(2位)", spec: "2", want: []int{2}},
		{name: "複数指定", spec: "1,3", want: []int{1, 3}},
		{name: "複数指定(3つ)", spec: "1,2,4", want: []int{1, 2, 4}},
		{name: "幅指定", spec: "1-4", want: []int{1, 2, 3, 4}},
		{name: "幅指定(同値)", spec: "3-3", want: []int{3}},
		{name: "スペースあり", spec: " 1 , 3 ", want: []int{1, 3}},
		{name: "空文字", spec: "", wantErr: true},
		{name: "ゼロ", spec: "0", wantErr: true},
		{name: "負数", spec: "-1", wantErr: true},
		{name: "文字列", spec: "abc", wantErr: true},
		{name: "逆範囲", spec: "4-1", wantErr: true},
		{name: "不正なカンマ区切り", spec: "1,abc", wantErr: true},
		{name: "不正な範囲", spec: "1-abc", wantErr: true},
		{name: "ゼロを含む複数指定", spec: "0,1", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseRankSpec(tt.spec)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseRankSpec(%q) error = %v, wantErr %v", tt.spec, err, tt.wantErr)
				return
			}
			if !tt.wantErr && !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseRankSpec(%q) = %v, want %v", tt.spec, got, tt.want)
			}
		})
	}
}
