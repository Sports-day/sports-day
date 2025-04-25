package auth

import "context"

type userContextKey struct{}

func AttachUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userContextKey{}, userID)
}

func GetUserID(ctx context.Context) (string, bool) {
	switch v := ctx.Value(userContextKey{}).(type) {
	case string:
		return v, true
	default:
		return "", false
	}
}
