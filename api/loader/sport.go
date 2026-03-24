package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newSportLoader(svc service.Sport) func(context.Context, []string) ([]*db_model.Sport, []error) {
	return func(ctx context.Context, ids []string) ([]*db_model.Sport, []error) {
		rowMap, err := svc.GetSportsMapByIDs(ctx, ids)
		if err != nil {
			return nil, []error{err}
		}
		res := make([]*db_model.Sport, len(ids))
		errs := make([]error, len(ids))
		for i, id := range ids {
			if row, ok := rowMap[id]; ok {
				res[i] = row
			} else {
				errs[i] = errors.ErrSportNotFound
			}
		}
		return res, errs
	}
}
func LoadSports(ctx context.Context, ids []string) ([]*db_model.Sport, error) {
	rows, err := getLoaders(ctx).SportLoader.LoadAll(ctx, ids)
	if err != nil && !errors.Is(err, errors.ErrSportNotFound) {
		return nil, errors.Wrap(err)
	}
	return slices.Filter(rows, func(row *db_model.Sport) bool { return row != nil }), nil
}
