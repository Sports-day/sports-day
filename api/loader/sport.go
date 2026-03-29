package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newSportLoader(svc service.Sport) func(context.Context, []string) ([]*db_model.Sport, []error) {
	return func(ctx context.Context, sportIDs []string) ([]*db_model.Sport, []error) {
		rowMap, err := svc.GetSportMapByIDs(ctx, sportIDs)
		if err != nil {
			return nil, []error{err}
		}

		sports := make([]*db_model.Sport, len(sportIDs))
		errs := make([]error, len(sportIDs))
		for i, sportID := range sportIDs {
			if sport, ok := rowMap[sportID]; ok {
				sports[i] = sport
			} else {
				errs[i] = errors.ErrSportNotFound
			}
		}
		return sports, errs
	}
}

func LoadSports(ctx context.Context, sportIDs []string) ([]*db_model.Sport, error) {
	rows, err := getLoaders(ctx).SportLoader.LoadAll(ctx, sportIDs)
	if err != nil && !errors.Is(err, errors.ErrSportNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Sport) bool {
		return row != nil
	})
	return rows, nil
}
