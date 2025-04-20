package middleware

import (
	"net/http"

	"sports-day/api/pkg/auth"
)

func Auth(jwt *auth.JWT) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := auth.GetTokenFromRequest(r)
			if err != nil {
				//	TODO unauthorized
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			tokenData, err := jwt.Validate(tokenString)
			if err != nil {
				//	TODO unauthorized
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			ctx := auth.AttachUserID(r.Context(), tokenData.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
