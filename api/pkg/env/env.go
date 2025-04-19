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
		CORSOrigins []string `envconfig:"SERVER_CORS_ORIGINS" default:"*"`
	}
	Auth struct {
		OIDC struct {
			IssuerURL   string `envconfig:"AUTH_ISSUER_URL" required:"true"`
			ClientID    string `envconfig:"AUTH_CLIENT_ID" required:"true"`
			SecretKey   string `envconfig:"AUTH_SECRET_KEY" required:"true"`
			RedirectURL string `envconfig:"AUTH_REDIRECT_URL" required:"true"`
		}
		JWT struct {
			SecretKey     string `envconfig:"JWT_SECRET_KEY" required:"true"`
			ExpirySeconds int    `envconfig:"JWT_EXPIRY_SECONDS" default:"3600"`
		}
	}
	Debug bool `envconfig:"DEBUG" default:"false"`
}

var _env Env

func Load() error {
	// load dotenv
	if err := godotenv.Load(); err != nil {
		return errors.Wrap(err)
	}
	// load env
	if err := envconfig.Process("", &_env); err != nil {
		return errors.Wrap(err)
	}

	return nil
}

func Get() Env {
	return _env
}
