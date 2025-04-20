package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenData struct {
	UserID string
	Email  string
	Name   string
}

type JWTConfig struct {
	SecretKey     []byte
	ExpirySeconds int
}

// Claims JWTクレーム
type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	jwt.RegisteredClaims
}

// JWT JWT操作を行う構造体
type JWT struct {
	config JWTConfig
}

// NewJWT 新しいJWTインスタンスを作成
func NewJWT(secretKey []byte, expirySeconds int) JWT {
	return JWT{
		config: JWTConfig{
			SecretKey:     secretKey,
			ExpirySeconds: expirySeconds,
		},
	}
}

// Generate JWTを生成する
func (j *JWT) Generate(data *TokenData) (string, error) {
	now := time.Now()
	expiryTime := now.Add(time.Duration(j.config.ExpirySeconds) * time.Second)

	claims := &Claims{
		UserID: data.UserID,
		Email:  data.Email,
		Name:   data.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiryTime),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(j.config.SecretKey)
	if err != nil {
		//	TODO replace error
		return "", err
	}

	return tokenString, nil
}

// Validate JWTの検証
func (j *JWT) Validate(tokenString string) (*TokenData, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return j.config.SecretKey, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			//	TODO replace error
			return nil, errors.New("token expired")
		}
		//	TODO replace error
		return nil, errors.New("invalid token")
	}

	if !token.Valid {
		//	TODO replace error
		return nil, errors.New("invalid token")
	}

	return &TokenData{
		UserID: claims.UserID,
		Email:  claims.Email,
		Name:   claims.Name,
	}, nil
}

func GetTokenFromRequest(r *http.Request) (string, error) {
	cookie, err := r.Cookie("token")
	if err == nil {
		return cookie.Value, nil
	}

	bearerToken := r.Header.Get("Authorization")
	if len(bearerToken) > 7 && bearerToken[:7] == "Bearer " {
		return bearerToken[7:], nil
	}

	//	TODO replace error
	return "", errors.New("no token found")
}
