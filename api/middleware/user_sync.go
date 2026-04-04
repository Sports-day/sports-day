package middleware

import (
	"net/http"

	"sports-day/api/pkg/auth"
	pkgerrors "sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func UserSync(authService service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			if err := authService.SyncUser(ctx); err != nil {
				if authErr, ok := err.(pkgerrors.Error); ok {
					http.Error(w, authErr.Error(), http.StatusUnauthorized)
					return
				}
				http.Error(w, pkgerrors.ErrUserSyncFailed.Error(), http.StatusInternalServerError)
				return
			}

			// sync後にユーザー情報を解決してcontextに注入
			user, err := authService.GetCurrentUser(ctx)
			if err != nil {
				http.Error(w, pkgerrors.ErrUnauthorized.Error(), http.StatusUnauthorized)
				return
			}

			role, err := authService.GetRole(ctx, user.ID)
			if err != nil {
				http.Error(w, pkgerrors.ErrorServerPanic.Error(), http.StatusInternalServerError)
				return
			}

			ctx = auth.AttachUser(ctx, &auth.AuthenticatedUser{
				ID:   user.ID,
				Role: role,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
