package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"sports-day/api"
	"sports-day/api/graph"
	"sports-day/api/middleware"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/env"
	"sports-day/api/pkg/gorm"
	"sports-day/api/repository"
	"sports-day/api/service"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {
	if err := env.Load(); err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	// setup logger
	api.NewLogger(env.Get().Debug)

	// fix timezone as Asia/Tokyo
	time.FixedZone("Asia/Tokyo", 9*60*60)

	// setup database
	db, err := gorm.OpenWithRetry(api.Logger)
	if err != nil {
		api.Logger.Fatal().
			Err(err).
			Str("label", "database").
			Msg("Failed to connect to database")
	}

	// setup oidc
	oidcRedirectURLs := strings.Split(env.Get().Auth.OIDC.RedirectURL, ",")
	oidc, err := auth.NewOIDC(
		context.Background(),
		env.Get().Auth.OIDC.IssuerURL,
		env.Get().Auth.OIDC.ClientID,
		env.Get().Auth.OIDC.SecretKey,
		oidcRedirectURLs,
	)
	if err != nil {
		api.Logger.Fatal().
			Err(err).
			Str("label", "auth").
			Msg("Failed to create oidc service")
	}

	// setup jwt
	jwt := auth.NewJWT(
		[]byte(env.Get().Auth.JWT.SecretKey),
		env.Get().Auth.JWT.ExpirySeconds,
	)

	// repository
	userRepository := repository.NewUser()
	groupRepository := repository.NewGroup()

	// service
	userService := service.NewUser(db, userRepository)
	authService := service.NewAuthService(db, userRepository, oidc, jwt)
	groupService := service.NewGroup(db, groupRepository, userRepository)

	// graphql
	config := graph.Config{Resolvers: graph.NewResolver(userService, authService, groupService)}
	srv := handler.New(graph.NewExecutableSchema(config))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.Use(extension.Introspection{})

	// mux
	mux := http.NewServeMux()

	// playground only in debug mode
	if env.Get().Debug {
		mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	}
	mux.Handle("/query", middleware.SetupMiddleware(srv, jwt, userService, groupService))

	address := fmt.Sprintf("%s:%d", env.Get().Server.Host, env.Get().Server.Port)

	server := &http.Server{
		Addr:    address,
		Handler: mux,
	}

	// channel to confirm server shutdown
	shutdownChan := make(chan struct{}, 1)

	// start server in another goroutine
	go func() {
		api.Logger.Info().Msgf("Starting server on http://%s", address)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			api.Logger.Fatal().
				Err(err).
				Msg("Failed to start server")
		}
		shutdownChan <- struct{}{}
	}()

	// create channel for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	// wait for signal
	<-quit
	api.Logger.Info().Msg("Shutting down server...")

	// set shutdown timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// shutdown server
	if err := server.Shutdown(ctx); err != nil {
		api.Logger.Fatal().
			Err(err).
			Msg("Server forced to shutdown")
	}

	// wait for server to shutdown
	<-shutdownChan

	api.Logger.Info().Msg("Server gracefully shutdown")
}
