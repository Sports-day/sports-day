package middleware

import (
	"net/http"

	"github.com/justinas/alice"

	"github.com/coreos/go-oidc/v3/oidc"

	"sports-day/api/service"
)

func SetupMiddleware(handler http.Handler, verifier *oidc.IDTokenVerifier, authSvc service.AuthService, userSvc service.User, groupSvc service.Group, teamSvc service.Team, competitionSvc service.Competition, locationSvc service.Location, matchSvc service.Match, judgmentSvc service.Judgment, leagueSvc service.League, tournamentSvc service.Tournament, sportSvc service.Sport, ruleSvc service.Rule, imageSvc service.Image, sceneSvc service.Scene) http.Handler {
	chain := alice.New()
	chain = chain.Append(CORS().Handler)
	chain = chain.Append(LoaderMiddleware(userSvc, groupSvc, teamSvc, competitionSvc, locationSvc, matchSvc, judgmentSvc, leagueSvc, tournamentSvc, sportSvc, ruleSvc, imageSvc, sceneSvc))
	chain = chain.Append(Auth(verifier))
	chain = chain.Append(UserSync(authSvc))

	return chain.Then(handler)
}
