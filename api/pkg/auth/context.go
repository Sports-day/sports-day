package auth

import "context"

type userContextKey struct{}
type authenticatedUserKey struct{}

type Claims struct {
	Sub             string
	MicrosoftUserID string
}

// AuthenticatedUser はミドルウェアで解決済みのユーザー情報。
type AuthenticatedUser struct {
	ID   string
	Role string
}

func AttachClaims(ctx context.Context, claims *Claims) context.Context {
	return context.WithValue(ctx, userContextKey{}, claims)
}

func GetClaims(ctx context.Context) (*Claims, bool) {
	switch v := ctx.Value(userContextKey{}).(type) {
	case *Claims:
		return v, true
	default:
		return nil, false
	}
}

func AttachUser(ctx context.Context, user *AuthenticatedUser) context.Context {
	return context.WithValue(ctx, authenticatedUserKey{}, user)
}

func GetUser(ctx context.Context) (*AuthenticatedUser, bool) {
	switch v := ctx.Value(authenticatedUserKey{}).(type) {
	case *AuthenticatedUser:
		return v, true
	default:
		return nil, false
	}
}
