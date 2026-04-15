package middleware

import (
	"net/http"

	api "sports-day/api"
	"sports-day/api/pkg/ulid"
)

// RequestIDHeader はリクエスト追跡に使用する HTTP ヘッダー名。
const RequestIDHeader = "X-Request-ID"

// RequestID はリクエストごとにユニークな ID を生成し、
// コンテキストに request_id フィールド付きのロガーを埋め込むミドルウェア。
//
// X-Request-ID ヘッダーが既に存在する場合はその値を使用し、
// なければ ULID を新規生成する。
// レスポンスヘッダーにも X-Request-ID を付与することで、
// クライアント・フロントエンド側でも同一リクエストの追跡が可能になる。
//
// 以降の処理で zerolog.Ctx(ctx) を使うと、
// すべてのログに request_id フィールドが自動付与される。
func RequestID() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			requestID := r.Header.Get(RequestIDHeader)
			if requestID == "" {
				requestID = ulid.Make()
			}

			// レスポンスヘッダーに付与（クライアント側での紐付けに使用）
			w.Header().Set(RequestIDHeader, requestID)

			// request_id フィールド付きの子ロガーをコンテキストに埋め込む
			logger := api.Logger.With().Str("request_id", requestID).Logger()
			ctx := logger.WithContext(r.Context())

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
