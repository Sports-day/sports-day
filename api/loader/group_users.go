package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newGroupUsersLoader(svc service.Group) func(context.Context, []string) ([][]*db_model.GroupUser, []error) {
	return func(ctx context.Context, groupIDs []string) ([][]*db_model.GroupUser, []error) {
		rowMap, err := svc.GetGroupUsersMapByGroupIDs(ctx, groupIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.GroupUser, len(groupIDs))
		for i, groupID := range groupIDs {
			if groupUsers, ok := rowMap[groupID]; ok {
				res[i] = groupUsers
			} else {
				res[i] = []*db_model.GroupUser{}
			}
		}

		return res, nil
	}
}

func LoadGroupUsers(ctx context.Context, groupID string) ([]*db_model.GroupUser, error) {
	rows, err := getLoaders(ctx).GroupUsersLoader.Load(ctx, groupID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
