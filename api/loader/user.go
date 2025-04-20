package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newUserLoader(svc service.User) func(context.Context, []string) ([]*db_model.User, []error) {
	return func(ctx context.Context, userIDs []string) ([]*db_model.User, []error) {
		rowMap, err := svc.GetUsersMapByIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}
		users := make([]*db_model.User, len(userIDs))
		errs := make([]error, len(userIDs))
		for i, userID := range userIDs {
			if user, ok := rowMap[userID]; ok {
				users[i] = user
			} else {
				errs[i] = errors.ErrUserNotFound
			}
		}
		return users, errs
	}
}

func LoadUsers(ctx context.Context, userIDs []string) ([]*db_model.User, error) {
	rows, err := getLoaders(ctx).UserLoader.LoadAll(ctx, userIDs)
	if err != nil && !errors.Is(err, errors.ErrUserNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.User) bool {
		return row != nil
	})

	return rows, nil
}
