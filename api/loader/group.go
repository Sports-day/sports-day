package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newGroupLoader(svc service.Group) func(context.Context, []string) ([]*db_model.Group, []error) {
	return func(ctx context.Context, groupIDs []string) ([]*db_model.Group, []error) {
		rowMap, err := svc.GetGroupsMapByIDs(ctx, groupIDs)
		if err != nil {
			return nil, []error{err}
		}
		groups := make([]*db_model.Group, len(groupIDs))
		errs := make([]error, len(groupIDs))
		for i, groupID := range groupIDs {
			if group, ok := rowMap[groupID]; ok {
				groups[i] = group
			} else {
				errs[i] = errors.ErrGroupNotFound
			}
		}
		return groups, errs
	}
}

func LoadGroups(ctx context.Context, groupIDs []string) ([]*db_model.Group, error) {
	rows, err := getLoaders(ctx).GroupLoader.LoadAll(ctx, groupIDs)
	if err != nil && !errors.Is(err, errors.ErrGroupNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Group) bool {
		return row != nil
	})

	return rows, nil
}
