package middleware

import (
	"net/http"

	"sports-day/api/loader"
	"sports-day/api/service"
)

func LoaderMiddleware(userSvc service.User, groupSvc service.Group, teamSvc service.Team) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			loaders := loader.New(userSvc, groupSvc, teamSvc)
			next.ServeHTTP(w, r.WithContext(loaders.Attach(r.Context())))
		})
	}
}
