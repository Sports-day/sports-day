package graph

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"gorm.io/gorm"

	"sports-day/api"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/authz"
	"sports-day/api/pkg/errors"
	"sports-day/api/repository"
)

// Directive は gqlgen のカスタムディレクティブハンドラを提供する構造体。
type Directive struct {
	authorizer   authz.Authorizer
	roleCache    *authz.RoleCache
	userRoleRepo repository.UserRole
	db           *gorm.DB
}

// NewDirective は Directive を初期化して返す。
func NewDirective(
	authorizer authz.Authorizer,
	roleCache *authz.RoleCache,
	userRoleRepo repository.UserRole,
	db *gorm.DB,
) *Directive {
	return &Directive{
		authorizer:   authorizer,
		roleCache:    roleCache,
		userRoleRepo: userRoleRepo,
		db:           db,
	}
}

// HasPermission は @hasPermission(permission: "...") ディレクティブの実装。
// contextのclaimsからsubを取得し、キャッシュ→DBでロールを解決して認可判定を行う。
func (d *Directive) HasPermission(
	ctx context.Context,
	obj any,
	next graphql.Resolver,
	permission string,
) (any, error) {
	claims, ok := auth.GetClaims(ctx)
	if !ok || claims.Sub == "" {
		return nil, errors.ErrUnauthorized
	}

	sub := claims.Sub

	// キャッシュからロールを取得
	role, hit := d.roleCache.Get(sub)
	if !hit {
		// キャッシュ MISS: DBから取得
		record, err := d.userRoleRepo.GetBySub(ctx, d.db, sub)
		if err != nil {
			if errors.Is(err, errors.ErrUserNotFound) {
				// ロール未割当の場合は FORBIDDEN
				api.Logger.Warn().
					Str("event", "authorization_denied").
					Str("sub", sub).
					Str("role", "").
					Str("required_permission", permission).
					Msg("role not assigned")
				return nil, errors.ErrForbidden
			}
			return nil, err
		}
		role = record.Role
		d.roleCache.Set(sub, role)
	}

	// 認可判定
	if !d.authorizer.HasPermission(role, permission) {
		api.Logger.Warn().
			Str("event", "authorization_denied").
			Str("sub", sub).
			Str("role", role).
			Str("required_permission", permission).
			Msg("permission denied")
		return nil, errors.ErrForbidden
	}

	return next(ctx)
}
