package middleware

import (
	"net/http"

	"github.com/justinas/alice"

	"sports-day/api/pkg/auth"
	"sports-day/api/service"
)

func SetupMiddleware(handler http.Handler, jwt auth.JWT, userSvc service.User, groupSvc service.Group) http.Handler {
	chain := alice.New()
	chain = chain.Append(CORS().Handler)
	chain = chain.Append(LoaderMiddleware(userSvc, groupSvc))
	// chain = chain.Append(Auth(jwt))

	return chain.Then(handler)
}
