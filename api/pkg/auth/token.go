package auth

import (
	"errors"
	"net/http"
)

func GetTokenFromRequest(r *http.Request) (string, error) {
	bearerToken := r.Header.Get("Authorization")
	if len(bearerToken) > 7 && bearerToken[:7] == "Bearer " {
		return bearerToken[7:], nil
	}

	return "", errors.New("no token found")
}
