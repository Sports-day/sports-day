package service

import (
	"context"
	"fmt"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"
)

// AuthService DB同期サービス
type AuthService struct {
	db       *gorm.DB
	userRepo repository.User
}

// NewAuthService DB同期サービスを作成
func NewAuthService(db *gorm.DB, userRepo repository.User) AuthService {
	return AuthService{
		db:       db,
		userRepo: userRepo,
	}
}

// SyncUser 認証済みのユーザー情報をDBと同期する
// 今後subで実装する予定があるため大幅変更予定
func (s *AuthService) SyncUser(ctx context.Context) error {
	claims, ok := auth.GetClaims(ctx)
	if !ok {
		return errors.ErrUnauthorized
	}

	if claims.Email == "" {
		log.Error().Msg("email not found in token")
		return errors.ErrUnauthorized
	}

	user, err := s.userRepo.FindByEmail(ctx, s.db, claims.Email)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("failed to find user")
		}

		// if user not found, create new user
		user = &db_model.User{
			ID:    ulid.Make(),
			Name:  claims.Name,
			Email: claims.Email,
		}
		_, err = s.userRepo.Save(ctx, s.db, user)
		if err != nil {
			return fmt.Errorf("failed to create user")
		}
	} else {
		// if user exists, update name (if necessary)
		if user.Name != claims.Name {
			user.Name = claims.Name
			_, err = s.userRepo.Save(ctx, s.db, user)
			if err != nil {
				return fmt.Errorf("failed to update user")
			}
		}
	}

	return nil
}

// GetCurrentUser 現在のユーザー情報を取得
func (s *AuthService) GetCurrentUser(ctx context.Context) (*db_model.User, error) {
	// get user id from middleware
	claims, ok := auth.GetClaims(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	// get user info by id
	user, err := s.userRepo.FindByEmail(ctx, s.db, claims.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, err
	}

	return user, nil
}
