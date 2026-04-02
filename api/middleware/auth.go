package middleware

import (
	"net/http"

	"github.com/coreos/go-oidc/v3/oidc"

	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/errors"
)

func Auth(verifier *oidc.IDTokenVerifier) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := auth.GetTokenFromRequest(r)
			if err != nil {
				http.Error(w, errors.ErrTokenMissing.Error(), http.StatusUnauthorized)
				return
			}

			token, err := verifier.Verify(r.Context(), tokenString)
			if err != nil {
				http.Error(w, errors.ErrTokenInvalid.Error(), http.StatusUnauthorized)
				return
			}

			var claims struct {
				Email           string `json:"email"`
				Name            string `json:"name"`
				Sub             string `json:"sub"`
				MicrosoftUserID string `json:"oid"`
			}

			if err := token.Claims(&claims); err != nil {
				http.Error(w, errors.ErrTokenClaimsInvalid.Error(), http.StatusUnauthorized)
				return
			}

			if claims.Sub == "" {
				http.Error(w, errors.ErrTokenClaimsInvalid.Error(), http.StatusUnauthorized)
				return
			}

			ctx := auth.AttachClaims(r.Context(), &auth.Claims{
				Sub:             claims.Sub,
				Email:           claims.Email,
				Name:            claims.Name,
				MicrosoftUserID: claims.MicrosoftUserID,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
