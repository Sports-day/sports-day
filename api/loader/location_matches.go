package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newLocationMatchesLoader(svc service.Match) func(context.Context, []string) ([][]*db_model.Match, []error) {
	return func(ctx context.Context, locationIDs []string) ([][]*db_model.Match, []error) {
		rowMap, err := svc.GetMatchesMapByLocationIDs(ctx, locationIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.Match, len(locationIDs))
		for i, locationID := range locationIDs {
			if matches, ok := rowMap[locationID]; ok {
				res[i] = matches
			} else {
				res[i] = []*db_model.Match{}
			}
		}
		return res, nil
	}
}

func LoadLocationMatches(ctx context.Context, locationID string) ([]*db_model.Match, error) {
	rows, err := getLoaders(ctx).LocationMatchesLoader.Load(ctx, locationID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
