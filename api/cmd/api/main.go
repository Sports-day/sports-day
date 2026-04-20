package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"sports-day/api"
	"sports-day/api/graph"
	apihandler "sports-day/api/handler"
	"sports-day/api/middleware"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/authz"
	"sports-day/api/pkg/env"
	pkgerrors "sports-day/api/pkg/errors"
	"sports-day/api/pkg/gorm"
	"sports-day/api/repository"
	"sports-day/api/service"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/rs/zerolog"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func main() {
	if err := env.Load(); err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}

	// setup logger
	api.NewLogger(env.Get().Debug)

	// fix timezone as Asia/Tokyo
	time.Local = time.FixedZone("Asia/Tokyo", 9*60*60)

	// サーバー起動時の設定サマリーをログに出力
	api.Logger.Info().
		Str("event", "server_init").
		Str("host", env.Get().Server.Host).
		Int("port", env.Get().Server.Port).
		Str("auth_issuer", env.Get().Auth.IssuerURL).
		Str("storage_endpoint", env.Get().Storage.Endpoint).
		Str("storage_bucket", env.Get().Storage.Bucket).
		Bool("debug", env.Get().Debug).
		Msg("Initializing Sports Day API")

	// setup database
	db, err := gorm.OpenWithRetry(api.Logger)
	if err != nil {
		api.Logger.Fatal().
			Err(err).
			Str("label", "database").
			Msg("Failed to connect to database")
	}

	// setup verifier (IdP Access Token検証用)
	verifier, err := auth.NewVerifier(
		context.Background(),
		env.Get().Auth.IssuerURL,
		env.Get().Auth.ClientID,
	)
	if err != nil {
		api.Logger.Fatal().
			Err(err).
			Str("label", "auth").
			Msg("Failed to create AT service")
	}

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
		config.WithRegion(env.Get().Storage.Region),
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

	publicEndpoint := env.Get().Storage.PublicEndpoint
	if publicEndpoint == "" {
		publicEndpoint = env.Get().Storage.Endpoint
	}
	s3PublicClient := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(publicEndpoint)
		o.UsePathStyle = true
	})

	// authorization
	authorizerInstance := authz.NewStaticAuthorizer()
	roleCache := authz.NewRoleCache(env.Get().Auth.RoleCacheTTL)

	// service
	userService := service.NewUser(db, userRepository, groupRepository)
	authService := service.NewAuthService(db, userRepository, roleCache, authorizerInstance)
	groupService := service.NewGroup(db, groupRepository, userRepository)
	teamService := service.NewTeam(db, teamRepository, userRepository)
	locationService := service.NewLocation(db, locationRepository)
	informationService := service.NewInformation(db, informationRepository)
	competitionService := service.NewCompetition(db, competitionRepository, teamRepository, leagueRepository, tournamentRepository, matchRepository, sportRepository, judgmentRepository)
	sceneService := service.NewScene(db, sceneRepository, &competitionService)
	matchService := service.NewMatch(db, matchRepository, teamRepository, locationRepository, competitionRepository, judgmentRepository)
	judgmentService := service.NewJudgment(db, judgmentRepository, teamRepository, groupRepository)
	leagueService := service.NewLeague(db, leagueRepository, matchRepository, competitionRepository, &competitionService, sportRepository, judgmentRepository)
	tournamentService := service.NewTournament(db, tournamentRepository, matchRepository, competitionRepository, judgmentRepository)
	leagueService.SetCompetitionService(&competitionService)
	matchService.SetCompetitionService(&competitionService)
	matchService.SetTournamentService(&tournamentService)
	matchService.SetJudgmentService(&judgmentService)
	tournamentService.SetCompetitionService(&competitionService)
	competitionService.SetTournamentService(&tournamentService)
	ruleService := service.NewRule(db, ruleRepository)
	imageService := service.NewImage(db, imageRepository, s3Client, s3PublicClient, env.Get().Storage.Bucket, env.Get().Storage.Endpoint)
	sportService := service.NewSports(db, sportRepository, &imageService, &competitionService)

	directiveHandler := graph.NewDirective(authorizerInstance)

	// graphql
	gqlConfig := graph.Config{Resolvers: graph.NewResolver(userService, authService, groupService, teamService, locationService, sportService, sceneService, informationService, competitionService, matchService, judgmentService, leagueService, tournamentService, ruleService, imageService)}
	gqlConfig.Directives.HasPermission = directiveHandler.HasPermission
	srv := handler.New(graph.NewExecutableSchema(gqlConfig))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	// GraphQL オペレーション単位のログ（クエリ名・実行時間・エラー有無）
	srv.AroundOperations(func(ctx context.Context, next graphql.OperationHandler) graphql.ResponseHandler {
		oc := graphql.GetOperationContext(ctx)
		opName := oc.OperationName
		opType := ""
		if oc.Operation != nil {
			opType = string(oc.Operation.Operation)
		}
		start := time.Now()
		respHandler := next(ctx)

		return func(ctx context.Context) *graphql.Response {
			resp := respHandler(ctx)
			duration := time.Since(start)
			hasError := resp != nil && len(resp.Errors) > 0

			log := zerolog.Ctx(ctx)
			entry := log.Info()
			if hasError {
				entry = log.Warn()
			}
			entry.
				Str("event", "graphql_operation").
				Str("op_type", opType).
				Str("op_name", opName).
				Int64("duration_ms", duration.Milliseconds()).
				Bool("has_error", hasError).
				Msg("GraphQL operation")

			return resp
		}
	})

	// GraphQL エラーをログに出力する。
	// アプリケーション定義のエラー（pkgerrors.Error）は Warn、
	// 予期しない内部エラーは Error として記録する。
	srv.SetErrorPresenter(func(ctx context.Context, err error) *gqlerror.Error {
		gqlerr := graphql.DefaultErrorPresenter(ctx, err)
		log := zerolog.Ctx(ctx)

		var appErr pkgerrors.Error
		if pkgerrors.As(err, &appErr) {
			log.Warn().
				Err(err).
				Str("event", "graphql_error").
				Str("error_code", appErr.Code()).
				Str("path", fmt.Sprintf("%v", gqlerr.Path)).
				Msg("GraphQL application error")
		} else {
			log.Error().
				Err(err).
				Str("event", "graphql_error").
				Str("path", fmt.Sprintf("%v", gqlerr.Path)).
				Msg("GraphQL internal error")
		}

		return gqlerr
	})

	srv.SetRecoverFunc(func(ctx context.Context, err any) error {
		zerolog.Ctx(ctx).Error().
			Str("event", "graphql_panic").
			Str("panic", fmt.Sprintf("%v", err)).
			Msg("GraphQL panic recovered")
		return fmt.Errorf("internal server error")
	})

	if env.Get().Debug {
		srv.Use(extension.Introspection{})
	}

	// mux
	mux := http.NewServeMux()

	// ヘルスチェックエンドポイント（認証不要・ログスキップ対象）
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"status":"ok"}`)
	})

	// playground only in debug mode
	if env.Get().Debug {
		mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	}
	mux.Handle("/query", middleware.SetupMiddleware(srv, verifier, authService, userService, groupService, teamService, competitionService, locationService, matchService, judgmentService, leagueService, tournamentService, sportService, ruleService, imageService, sceneService))
	mux.Handle(
		"/internal/webhooks/upload",
		apihandler.HandleUploadWebhook(
			&imageService,
			env.Get().Storage.WebhookSecret,
			publicEndpoint,
			env.Get().Storage.Bucket,
		),
	)

	address := fmt.Sprintf("%s:%d", env.Get().Server.Host, env.Get().Server.Port)

	server := &http.Server{
		Addr:              address,
		Handler:           mux,
		ReadTimeout:       30 * time.Second,
		ReadHeaderTimeout: 10 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	// channel to confirm server shutdown
	shutdownChan := make(chan struct{}, 1)

	// API 死活監視用ハートビートログ（60秒ごとに出力）
	// Grafana アラートルール "API停止" がこのイベントの欠落を検知する
	heartbeatCtx, cancelHeartbeat := context.WithCancel(context.Background())
	go func() {
		ticker := time.NewTicker(60 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				api.Logger.Info().Str("event", "heartbeat").Msg("API heartbeat")
			case <-heartbeatCtx.Done():
				return
			}
		}
	}()

	// create channel for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	// start server in another goroutine
	go func() {
		api.Logger.Info().
			Str("event", "server_started").
			Str("address", address).
			Msgf("Sports Day API started on http://%s", address)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			api.Logger.Fatal().
				Err(err).
				Msg("Failed to start server")
		}
		shutdownChan <- struct{}{}
	}()

	// wait for signal
	<-quit
	cancelHeartbeat()
	api.Logger.Info().Str("event", "server_shutting_down").Msg("Shutting down server...")

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

	// stop role cache purge goroutine
	roleCache.Stop()

	// close database connection
	if sqlDB, err := db.DB(); err == nil {
		sqlDB.Close()
	}

	api.Logger.Info().Str("event", "server_shutdown").Msg("Server gracefully shutdown")
}
