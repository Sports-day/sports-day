package middleware

import (
	"net/http"

	"sports-day/api/loader"
	"sports-day/api/service"
)

func LoaderMiddleware(userSvc service.User, groupSvc service.Group, teamSvc service.Team, competitionSvc service.Competition, locationSvc service.Location, matchSvc service.Match, judgmentSvc service.Judgment, leagueSvc service.League, sceneSvc service.Scene, sportSvc service.Sport) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			loaders := loader.New(userSvc, groupSvc, teamSvc, competitionSvc, locationSvc, matchSvc, judgmentSvc, leagueSvc, sceneSvc, sportSvc)
			next.ServeHTTP(w, r.WithContext(loaders.Attach(r.Context())))
		})
	}
}
