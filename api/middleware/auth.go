package middleware

import (
	"net/http"

	"github.com/coreos/go-oidc/v3/oidc"

	api "sports-day/api"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/errors"
)

func Auth(verifier *oidc.IDTokenVerifier) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString, err := auth.GetTokenFromRequest(r)
			if err != nil {
				api.Logger.Warn().
					Str("event", "token_missing").
					Str("method", r.Method).
					Str("path", r.URL.Path).
					Str("remote_addr", r.RemoteAddr).
					Msg("Authorization header is missing or malformed")
				http.Error(w, errors.ErrTokenMissing.Error(), http.StatusUnauthorized)
				return
			}

			token, err := verifier.Verify(r.Context(), tokenString)
			if err != nil {
				api.Logger.Warn().
					Err(err).
					Str("event", "token_invalid").
					Str("method", r.Method).
					Str("path", r.URL.Path).
					Str("remote_addr", r.RemoteAddr).
					Msg("ID token verification failed")
				http.Error(w, errors.ErrTokenInvalid.Error(), http.StatusUnauthorized)
				return
			}

			var claims struct {
				Sub             string `json:"sub"`
				MicrosoftUserID string `json:"oid"`
			}

			if err := token.Claims(&claims); err != nil {
				api.Logger.Warn().
					Err(err).
					Str("event", "token_claims_invalid").
					Str("method", r.Method).
					Str("path", r.URL.Path).
					Msg("Failed to extract claims from token")
				http.Error(w, errors.ErrTokenClaimsInvalid.Error(), http.StatusUnauthorized)
				return
			}

			if claims.Sub == "" {
				api.Logger.Warn().
					Str("event", "token_claims_invalid").
					Str("method", r.Method).
					Str("path", r.URL.Path).
					Msg("Token claims missing required 'sub' field")
				http.Error(w, errors.ErrTokenClaimsInvalid.Error(), http.StatusUnauthorized)
				return
			}

			api.Logger.Debug().
				Str("event", "token_verified").
				Str("sub", claims.Sub).
				Str("method", r.Method).
				Str("path", r.URL.Path).
				Msg("ID token verified successfully")

			ctx := auth.AttachClaims(r.Context(), &auth.Claims{
				Sub:             claims.Sub,
				MicrosoftUserID: claims.MicrosoftUserID,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
