package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"
)

func newUserIdpLoader(svc service.User) func(context.Context, []string) ([]*db_model.UsersIdp, []error) {
	return func(ctx context.Context, userIDs []string) ([]*db_model.UsersIdp, []error) {
		rowMap, err := svc.GetUserIdpMapByUserIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}
		results := make([]*db_model.UsersIdp, len(userIDs))
		for i, userID := range userIDs {
			results[i] = rowMap[userID] // nilの場合もある（IdP未登録）
		}
		return results, nil
	}
}

func LoadUserIdp(ctx context.Context, userID string) (*db_model.UsersIdp, error) {
	return getLoaders(ctx).UserIdpLoader.Load(ctx, userID)
}
