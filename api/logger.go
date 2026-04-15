package api

import (
	"os"

	"github.com/rs/zerolog"
)

var Logger = func() *zerolog.Logger {
	l := zerolog.Nop()
	return &l
}()

func SetLogger(logger *zerolog.Logger) {
	Logger = logger
}

// NewLogger はアプリケーションのロガーを初期化する。
//
// debug=true（開発環境）: 人間が読みやすい ConsoleWriter 形式で stdout に出力する。
// Caller フィールドでソースファイルの場所を確認できる。
//
// debug=false（本番環境）: JSON 形式で stdout に出力する。
// Grafana Alloy が Docker コンテナの stdout を収集し、Loki に転送するために
// JSON フォーマットが必要。Stack() を有効にすることで、
// github.com/pkg/errors でラップされたエラーのスタックトレースが
// JSON ログに自動的に含まれる。
func NewLogger(debug bool) {
	level := zerolog.InfoLevel
	if debug {
		level = zerolog.DebugLevel
	}
	zerolog.SetGlobalLevel(level)

	var logger zerolog.Logger
	if debug {
		output := zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: "15:04:05",
		}
		logger = zerolog.New(output).
			With().
			Timestamp().
			Caller().
			Stack().
			Str("app", "sports-day-api").
			Logger()
	} else {
		// 本番: JSON 形式（Loki/Alloy でそのまま取り込める）
		// Caller() は本番では省略（全ログへの付与はコスト高・ノイズになるため）
		// Stack() は github.com/pkg/errors のスタックトレース抽出のために有効化
		logger = zerolog.New(os.Stdout).
			With().
			Timestamp().
			Stack().
			Str("app", "sports-day-api").
			Logger()
	}

	SetLogger(&logger)
}
