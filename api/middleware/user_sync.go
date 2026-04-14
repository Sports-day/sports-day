package middleware

import (
	"net/http"

	api "sports-day/api"
	"sports-day/api/pkg/auth"
	pkgerrors "sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func UserSync(authService service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()

			claims, _ := auth.GetClaims(ctx)
			sub := ""
			if claims != nil {
				sub = claims.Sub
			}

			if err := authService.SyncUser(ctx); err != nil {
				if authErr, ok := err.(pkgerrors.Error); ok {
					api.Logger.Warn().
						Err(authErr).
						Str("event", "user_sync_failed").
						Str("sub", sub).
						Str("error_code", authErr.Code()).
						Msg("User sync failed with auth error")
					http.Error(w, authErr.Error(), http.StatusUnauthorized)
					return
				}
				api.Logger.Error().
					Err(err).
					Str("event", "user_sync_failed").
					Str("sub", sub).
					Msg("User sync failed with unexpected error")
				http.Error(w, pkgerrors.ErrUserSyncFailed.Error(), http.StatusInternalServerError)
				return
			}

			// sync後にユーザー情報を解決してcontextに注入
			user, err := authService.GetCurrentUser(ctx)
			if err != nil {
				api.Logger.Warn().
					Err(err).
					Str("event", "user_resolve_failed").
					Str("sub", sub).
					Msg("Failed to resolve current user after sync")
				http.Error(w, pkgerrors.ErrUnauthorized.Error(), http.StatusUnauthorized)
				return
			}

			role, err := authService.GetRole(ctx, user.ID)
			if err != nil {
				api.Logger.Error().
					Err(err).
					Str("event", "role_resolve_failed").
					Str("user_id", user.ID).
					Str("sub", sub).
					Msg("Failed to resolve user role")
				http.Error(w, pkgerrors.ErrorServerPanic.Error(), http.StatusInternalServerError)
				return
			}

			api.Logger.Debug().
				Str("event", "auth_completed").
				Str("user_id", user.ID).
				Str("role", role).
				Str("method", r.Method).
				Str("path", r.URL.Path).
				Msg("User authenticated successfully")

			ctx = auth.AttachUser(ctx, &auth.AuthenticatedUser{
				ID:   user.ID,
				Role: role,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
