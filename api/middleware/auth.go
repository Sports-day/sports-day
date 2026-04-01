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
				writeErrorResponse(w, http.StatusUnauthorized, errors.ErrTokenMissing)
				return
			}

			token, err := verifier.Verify(r.Context(), tokenString)
			if err != nil {
				writeErrorResponse(w, http.StatusUnauthorized, errors.ErrTokenInvalid)
				return
			}

			var claims struct {
				Email string `json:"email"`
				Name  string `json:"name"`
				Sub   string `json:"sub"`
			}

			if err := token.Claims(&claims); err != nil {
				writeErrorResponse(w, http.StatusUnauthorized, errors.ErrTokenClaimsInvalid)
				return
			}

			if claims.Sub == "" {
				writeErrorResponse(w, http.StatusUnauthorized, errors.ErrTokenClaimsInvalid)
				return
			}

			//格納する値は要検討
			ctx := auth.AttachClaims(r.Context(), &auth.Claims{
				Sub:   claims.Sub,
				Email: claims.Email,
				Name:  claims.Name,
			})
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
