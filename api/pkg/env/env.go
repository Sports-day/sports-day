package env

import (
	"sports-day/api/pkg/errors"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Env struct {
	RDB struct {
		Address string `envconfig:"RDB_ADDRESS" default:"mysql:3306"`
		User    string `envconfig:"RDB_USER" default:"root"`
		Pass    string `envconfig:"RDB_PASS" default:"root"`
		Name    string `envconfig:"RDB_NAME" default:"sportsday"`
	}
	Server struct {
		Host        string   `envconfig:"SERVER_HOST" default:"127.0.0.1"`
		Port        int      `envconfig:"SERVER_PORT" default:"8080"`
		CORSOrigins []string `envconfig:"SERVER_CORS_ORIGINS" required:"true"`
	}
	Auth struct {
		IssuerURL    string `envconfig:"AUTH_ISSUER_URL" required:"true"`
		ClientID     string `envconfig:"AUTH_CLIENT_ID" required:"true"`
		RoleCacheTTL int    `envconfig:"AUTH_ROLE_CACHE_TTL" default:"60"`
	}
	Storage struct {
		Endpoint       string `envconfig:"STORAGE_ENDPOINT"`
		PublicEndpoint string `envconfig:"STORAGE_PUBLIC_ENDPOINT"`
		Region         string `envconfig:"STORAGE_REGION" default:"us-east-1"`
		Bucket         string `envconfig:"STORAGE_BUCKET"`
		AccessKey      string `envconfig:"STORAGE_ACCESS_KEY"`
		SecretKey      string `envconfig:"STORAGE_SECRET_KEY"`
		WebhookSecret  string `envconfig:"STORAGE_WEBHOOK_SECRET" required:"true"`
	}

	Debug bool `envconfig:"DEBUG" default:"false"`
}

var _env Env

func Load() error {
	// load dotenv (.env ファイルが存在する場合のみ読み込む)
	_ = godotenv.Load()
	// load env
	if err := envconfig.Process("", &_env); err != nil {
		return errors.Wrap(err)
	}

	return nil
}

func Get() Env {
	return _env
}
