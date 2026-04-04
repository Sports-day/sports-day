package graph

import (
	"context"

	"github.com/99designs/gqlgen/graphql"

	"sports-day/api"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/authz"
	"sports-day/api/pkg/errors"
)

// Directive は gqlgen のカスタムディレクティブハンドラを提供する構造体。
type Directive struct {
	authorizer authz.Authorizer
}

// NewDirective は Directive を初期化して返す。
func NewDirective(authorizer authz.Authorizer) *Directive {
	return &Directive{
		authorizer: authorizer,
	}
}

// HasPermission は @hasPermission(permission: "...") ディレクティブの実装。
// ミドルウェアで注入済みのAuthenticatedUserからロールを取得して認可判定を行う。
func (d *Directive) HasPermission(
	ctx context.Context,
	obj any,
	next graphql.Resolver,
	permission string,
) (any, error) {
	user, ok := auth.GetUser(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	if !d.authorizer.HasPermission(user.Role, permission) {
		api.Logger.Warn().
			Str("event", "authorization_denied").
			Str("user_id", user.ID).
			Str("role", user.Role).
			Str("required_permission", permission).
			Msg("permission denied")
		return nil, errors.ErrForbidden
	}

	return next(ctx)
}
