package middleware

import (
	"fmt"
	"net/http"

	"sports-day/api/pkg/errors"
)

func writeErrorResponse(w http.ResponseWriter, status int, e errors.Error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	fmt.Fprintf(w, `{"code":"%s","message":"%s"}`, e.Code(), e.Message())
}
