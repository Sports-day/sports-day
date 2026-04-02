package service

import (
	"context"
	"fmt"

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

// findUserIdp claimsのsub / microsoft_user_idでusers_idpを検索する
// sub検索がヒットしない場合はmicrosoft_user_idでフォールバックし、
// 見つかった場合はsubを書き込んで更新する（管理者事前登録ユーザーの初回ログイン対応）
func (s *AuthService) findUserIdp(ctx context.Context, claims *auth.Claims) (*db_model.UsersIdp, error) {
	if claims.Sub != "" {
		record, err := s.userRepo.FindUserIdpBySub(ctx, s.db, claims.Sub)
		if err == nil {
			return record, nil
		}
		if !errors.Is(err, errors.ErrUserNotFound) {
			return nil, err
		}
		// sub で見つからない場合は microsoft_user_id でフォールバック
		if claims.MicrosoftUserID != "" {
			record, err = s.userRepo.FindUserIdpByMicrosoftUserID(ctx, s.db, claims.MicrosoftUserID)
			if err == nil {
				record.Sub.String = claims.Sub
				record.Sub.Valid = true
				return s.userRepo.SaveUserIdp(ctx, s.db, record)
			}
		}
		return nil, errors.ErrUserNotFound
	}
	return s.userRepo.FindUserIdpByMicrosoftUserID(ctx, s.db, claims.MicrosoftUserID)
}

// SyncUser 認証済みのユーザー情報をDBと同期する
func (s *AuthService) SyncUser(ctx context.Context) error {
	claims, ok := auth.GetClaims(ctx)
	if !ok {
		return errors.ErrUnauthorized
	}

	_, err := s.findUserIdp(ctx, claims)
	if err == nil {
		// 既存ユーザー — 何もしない
		return nil
	}
	if !errors.Is(err, errors.ErrUserNotFound) {
		return fmt.Errorf("failed to find user idp: %w", err)
	}

	// users_idpに存在しない → usersとusers_idpをトランザクションで新規作成
	return s.db.Transaction(func(tx *gorm.DB) error {
		newUser := &db_model.User{ID: ulid.Make()}
		if _, err := s.userRepo.Save(ctx, tx, newUser); err != nil {
			return fmt.Errorf("failed to create user: %w", err)
		}

		newIdp := &db_model.UsersIdp{
			UserID:   newUser.ID,
			Provider: "microsoft",
		}
		newIdp.Sub.String = claims.Sub
		newIdp.Sub.Valid = claims.Sub != ""
		newIdp.MicrosoftUserID.String = claims.MicrosoftUserID
		newIdp.MicrosoftUserID.Valid = claims.MicrosoftUserID != ""

		if _, err := s.userRepo.SaveUserIdp(ctx, tx, newIdp); err != nil {
			return fmt.Errorf("failed to create user idp: %w", err)
		}

		return nil
	})
}

// GetCurrentUser 現在のユーザー情報を取得
func (s *AuthService) GetCurrentUser(ctx context.Context) (*db_model.User, error) {
	claims, ok := auth.GetClaims(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	idpRecord, err := s.findUserIdp(ctx, claims)
	if err != nil {
		if errors.Is(err, errors.ErrUserNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, err
	}

	return s.userRepo.Get(ctx, s.db, idpRecord.UserID)
}
