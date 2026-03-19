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
	"sports-day/api/internal/webhook"
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
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
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
	sportRepository := repository.NewSports()
	teamRepository := repository.NewTeam()
	locationRepository := repository.NewLocation()
	sceneRepository := repository.NewScene()
	informationRepository := repository.NewInformation()
	competitionRepository := repository.NewCompetition()
	matchRepository := repository.NewMatch()
	judgmentRepository := repository.NewJudgment()
	leagueRepository := repository.NewLeague()
	tournamentRepository := repository.NewTournament()
	ruleRepository := repository.NewRule()
	imageRepository := repository.NewImage()

	cfg, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion("us-east-1"),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				env.Get().Storage.AccessKey,
				env.Get().Storage.SecretKey,
				"",
			),
		),
	)
	if err != nil {
		api.Logger.Fatal().Err(err).Msg("failed to load aws config")
	}

	s3Client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(env.Get().Storage.Endpoint)
		o.UsePathStyle = true
	})

	// service
	userService := service.NewUser(db, userRepository)
	authService := service.NewAuthService(db, userRepository, oidc, jwt)
	groupService := service.NewGroup(db, groupRepository, userRepository)
	teamService := service.NewTeam(db, teamRepository, userRepository)
	locationService := service.NewLocation(db, locationRepository)
	sceneService := service.NewScene(db, sceneRepository)
	informationService := service.NewInformation(db, informationRepository)
	competitionService := service.NewCompetition(db, competitionRepository, teamRepository, leagueRepository, matchRepository, sportRepository)
	matchService := service.NewMatch(db, matchRepository, teamRepository, locationRepository, competitionRepository, judgmentRepository)
	judgmentService := service.NewJudgment(db, judgmentRepository)
	leagueService := service.NewLeague(db, leagueRepository, matchRepository, competitionRepository, &competitionService, sportRepository)
	tournamentService := service.NewTournament(db, tournamentRepository, matchRepository, competitionRepository, judgmentRepository)
	leagueService.SetCompetitionService(&competitionService)
	matchService.SetCompetitionService(&competitionService)
	matchService.SetTournamentService(&tournamentService)
	tournamentService.SetCompetitionService(&competitionService)
	competitionService.SetTournamentService(&tournamentService)
	ruleService := service.NewRule(db, ruleRepository)
	sportService := service.NewSports(
		db,
		sportRepository,
		imageRepository,
	)

	imageService := service.NewImage(
		db,
		imageRepository,
		s3Client,
		env.Get().Storage.Bucket,
	)

	// graphql
	config := graph.Config{Resolvers: graph.NewResolver(userService, authService, groupService, teamService, locationService, sportService, sceneService, informationService, competitionService, matchService, judgmentService, leagueService, tournamentService, ruleService, imageService)}
	srv := handler.New(graph.NewExecutableSchema(config))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.Use(extension.Introspection{})

	// mux
	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/images/presign", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		ctx := r.Context()

		img, url, err := imageService.CreateUploadURL(ctx)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"upload_url":"%s","image_id":"%s"}`, url, img.ID)
	})

	// playground only in debug mode
	if env.Get().Debug {
		mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	}
	mux.Handle("/query", middleware.SetupMiddleware(srv, jwt, userService, groupService, teamService, competitionService, locationService, matchService, judgmentService, leagueService, tournamentService, sportService, ruleService))
	mux.Handle(
		"/internal/webhooks/upload",
		webhook.HandleUploadWebhook(
			imageRepository,
			db,
			env.Get().Auth.JWT.SecretKey,
			env.Get().Storage.Endpoint,
			env.Get().Storage.Bucket,
		),
	)

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
