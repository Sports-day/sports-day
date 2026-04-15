package service

import (
	"context"

	"github.com/rs/zerolog"
	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/authz"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"
)

// AuthService 認証・認可サービス
type AuthService struct {
	db         *gorm.DB
	userRepo   repository.User
	roleCache  *authz.RoleCache
	authorizer authz.Authorizer
}

// NewAuthService 認証・認可サービスを作成
func NewAuthService(db *gorm.DB, userRepo repository.User, roleCache *authz.RoleCache, authorizer authz.Authorizer) AuthService {
	return AuthService{
		db:         db,
		userRepo:   userRepo,
		roleCache:  roleCache,
		authorizer: authorizer,
	}
}

// findUserIdp claimsのsub / microsoft_user_idでusers_idpを検索する
func (s *AuthService) findUserIdp(ctx context.Context, claims *auth.Claims) (*db_model.UsersIdp, error) {
	if claims.Sub != "" {
		record, err := s.userRepo.FindUserIdpBySub(ctx, s.db, claims.Sub)
		if err == nil {
			return record, nil
		}
		if !errors.Is(err, errors.ErrUserNotFound) {
			return nil, err
		}
		if claims.MicrosoftUserID != "" {
			record, err = s.userRepo.FindUserIdpByMicrosoftUserID(ctx, s.db, claims.MicrosoftUserID)
			if err == nil {
				record.Sub.String = claims.Sub
				record.Sub.Valid = true
				return s.userRepo.SaveUserIdp(ctx, s.db, record)
			}
			if !errors.Is(err, errors.ErrUserNotFound) {
				return nil, err
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
		return nil
	}
	if !errors.Is(err, errors.ErrUserNotFound) {
		return errors.Wrap(err)
	}

	zerolog.Ctx(ctx).Info().
		Str("event", "user_provisioning").
		Str("sub", claims.Sub).
		Msg("New user detected, provisioning user and IDP record")

	return s.db.Transaction(func(tx *gorm.DB) error {
		newUser := &db_model.User{ID: ulid.Make()}
		if _, err := s.userRepo.Save(ctx, tx, newUser); err != nil {
			zerolog.Ctx(ctx).Error().
				Err(err).
				Str("event", "user_save_failed").
				Str("sub", claims.Sub).
				Msg("Failed to save new user record")
			return errors.ErrSaveUser
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
			zerolog.Ctx(ctx).Error().
				Err(err).
				Str("event", "user_idp_save_failed").
				Str("user_id", newUser.ID).
				Str("sub", claims.Sub).
				Msg("Failed to save IDP record for new user")
			return errors.ErrSaveUserIdp
		}

		zerolog.Ctx(ctx).Info().
			Str("event", "user_provisioned").
			Str("user_id", newUser.ID).
			Str("sub", claims.Sub).
			Str("provider", "microsoft").
			Msg("New user and IDP record created successfully")

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

// GetRole user_idに対応するロール文字列を返す。未割当の場合は "participant" を返す。
func (s *AuthService) GetRole(ctx context.Context, userID string) (string, error) {
	role, hit := s.roleCache.Get(userID)
	if hit {
		return role, nil
	}

	record, err := s.userRepo.GetRoleByUserID(ctx, s.db, userID)
	if err != nil {
		if errors.Is(err, errors.ErrRoleNotFound) {
			zerolog.Ctx(ctx).Warn().
				Str("event", "user_role_not_found").
				Str("user_id", userID).
				Msg("User role not found, returning default role: participant")
			return "participant", nil
		}
		return "", err
	}
	s.roleCache.Set(record.UserID, record.Role)
	return record.Role, nil
}

// roleLevel はロールの序列を返す。数値が大きいほど上位。
func roleLevel(role string) int {
	switch role {
	case "admin":
		return 3
	case "organizer":
		return 2
	default:
		return 1
	}
}

// ChangeUserRole バリデーション付きでユーザーのロールを変更する。
// 自己変更防止、上位ロールへの操作禁止、上位ロールの付与禁止を検証する。
func (s *AuthService) ChangeUserRole(ctx context.Context, callerID string, targetUserID string, newRole string) error {
	// 自己変更防止
	if callerID == targetUserID {
		zerolog.Ctx(ctx).Warn().
			Str("event", "role_change_denied").
			Str("reason", "self_change").
			Str("caller_id", callerID).
			Msg("User attempted to change own role")
		return errors.ErrSelfRoleChange
	}

	callerRole, err := s.GetRole(ctx, callerID)
	if err != nil {
		return err
	}
	callerLevel := roleLevel(callerRole)

	// 対象ユーザーのロールが自分より上なら操作不可
	targetRole, err := s.GetRole(ctx, targetUserID)
	if err != nil {
		return err
	}
	if roleLevel(targetRole) > callerLevel {
		zerolog.Ctx(ctx).Warn().
			Str("event", "role_change_denied").
			Str("reason", "target_higher_role").
			Str("caller_id", callerID).
			Str("caller_role", callerRole).
			Str("target_user_id", targetUserID).
			Str("target_role", targetRole).
			Msg("Insufficient role to modify higher-level user")
		return errors.ErrInsufficientRole
	}

	// 変更先ロールが自分より上なら不可
	if roleLevel(newRole) > callerLevel {
		zerolog.Ctx(ctx).Warn().
			Str("event", "role_change_denied").
			Str("reason", "new_role_higher").
			Str("caller_id", callerID).
			Str("caller_role", callerRole).
			Str("target_user_id", targetUserID).
			Str("new_role", newRole).
			Msg("Insufficient role to assign higher-level role")
		return errors.ErrInsufficientRole
	}

	zerolog.Ctx(ctx).Info().
		Str("event", "role_changed").
		Str("caller_id", callerID).
		Str("caller_role", callerRole).
		Str("target_user_id", targetUserID).
		Str("old_role", targetRole).
		Str("new_role", newRole).
		Msg("User role changed")

	return s.updateRole(ctx, targetUserID, newRole)
}

// updateRole ユーザーのロールを更新する（内部用）。
func (s *AuthService) updateRole(ctx context.Context, userID string, role string) error {
	if _, err := s.userRepo.SaveRole(ctx, s.db, &db_model.UserRole{
		UserID: userID,
		Role:   role,
	}); err != nil {
		return err
	}
	s.roleCache.Delete(userID)
	return nil
}

// EnsureDefaultRole ロールが未割当の場合に participant をデフォルト付与する。
func (s *AuthService) EnsureDefaultRole(ctx context.Context, userID string) error {
	_, err := s.userRepo.GetRoleByUserID(ctx, s.db, userID)
	if err == nil {
		return nil
	}
	if !errors.Is(err, errors.ErrRoleNotFound) {
		return err
	}
	return s.updateRole(ctx, userID, "participant")
}
