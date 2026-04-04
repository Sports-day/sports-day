package loader

import (
	"context"

	"sports-day/api/service"
)

func newUserRoleLoader(svc service.User) func(context.Context, []string) ([]string, []error) {
	return func(ctx context.Context, userIDs []string) ([]string, []error) {
		roleMap, err := svc.GetRoleMapByUserIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}
		results := make([]string, len(userIDs))
		for i, userID := range userIDs {
			if role, ok := roleMap[userID]; ok {
				results[i] = role
			} else {
				results[i] = "participant"
			}
		}
		return results, nil
	}
}

func LoadUserRole(ctx context.Context, userID string) (string, error) {
	return getLoaders(ctx).UserRoleLoader.Load(ctx, userID)
}
