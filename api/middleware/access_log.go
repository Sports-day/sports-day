package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

// responseWriter は HTTP レスポンスのステータスコードと書き込みバイト数を
// 計測するためのラッパー。WriteHeader が明示的に呼ばれない場合は 200 とみなす。
type responseWriter struct {
	http.ResponseWriter
	statusCode   int
	bytesWritten int
}

func (rw *responseWriter) WriteHeader(statusCode int) {
	rw.statusCode = statusCode
	rw.ResponseWriter.WriteHeader(statusCode)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytesWritten += n
	return n, err
}

// skipAccessLog はアクセスログをスキップするリクエストを判定する。
//   - OPTIONS: CORS プリフライトは毎回ログに出ても意味がないためスキップ
//   - /healthz: ロードバランサーやdocker healthcheckによる大量リクエストをスキップ
func skipAccessLog(r *http.Request) bool {
	if r.Method == http.MethodOptions {
		return true
	}
	p := r.URL.Path
	return p == "/healthz" || strings.HasPrefix(p, "/healthz/")
}

// AccessLog は全 HTTP リクエストのアクセスログを出力するミドルウェア。
// RequestID ミドルウェアより後に配置することで、すべてのログに
// request_id フィールドが自動付与される。
//
// ログレベルはステータスコードで自動分類:
//   - 5xx → Error
//   - 4xx → Warn
//   - その他 → Info
func AccessLog() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if skipAccessLog(r) {
				next.ServeHTTP(w, r)
				return
			}

			start := time.Now()
			rw := &responseWriter{
				ResponseWriter: w,
				statusCode:     http.StatusOK,
			}

			next.ServeHTTP(rw, r)

			duration := time.Since(start)
			logger := zerolog.Ctx(r.Context())

			var entry *zerolog.Event
			switch {
			case rw.statusCode >= 500:
				entry = logger.Error()
			case rw.statusCode >= 400:
				entry = logger.Warn()
			default:
				entry = logger.Info()
			}

			entry.
				Str("event", "http_request").
				Str("method", r.Method).
				Str("path", r.URL.Path).
				Str("remote_addr", r.RemoteAddr).
				Str("user_agent", r.UserAgent()).
				Int("status", rw.statusCode).
				Int64("duration_ms", duration.Milliseconds()).
				Int("bytes", rw.bytesWritten).
				Msg("HTTP request")
		})
	}
}
