package auth

import "context"

type userContextKey struct{}

type Claims struct {
	Sub             string
	Email           string
	Name            string
	MicrosoftUserID string
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
