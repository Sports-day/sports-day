package middleware

import (
	"net/http"

	pkgerrors "sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func UserSync(authService service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if err := authService.SyncUser(r.Context()); err != nil {
				if authErr, ok := err.(pkgerrors.Error); ok {
					http.Error(w, authErr.Error(), http.StatusUnauthorized)
					return
				}
				http.Error(w, pkgerrors.ErrUserSyncFailed.Error(), http.StatusInternalServerError)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
