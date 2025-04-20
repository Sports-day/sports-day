package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newUserGroupsLoader(svc service.Group) func(context.Context, []string) ([][]*db_model.GroupUser, []error) {
	return func(ctx context.Context, userIDs []string) ([][]*db_model.GroupUser, []error) {
		rowMap, err := svc.GetGroupUsersMapByUserIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.GroupUser, len(userIDs))
		for i, userID := range userIDs {
			if groupUsers, ok := rowMap[userID]; ok {
				res[i] = groupUsers
			} else {
				res[i] = []*db_model.GroupUser{}
			}
		}

		return res, nil
	}
}

func LoadUserGroups(ctx context.Context, userID string) ([]*db_model.GroupUser, error) {
	rows, err := getLoaders(ctx).UserGroupsLoader.Load(ctx, userID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
