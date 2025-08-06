package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newLocationCompetitionsLoader(svc service.Competition) func(context.Context, []string) ([][]*db_model.Competition, []error) {
	return func(ctx context.Context, locationIDs []string) ([][]*db_model.Competition, []error) {
		rowMap, err := svc.GetCompetitionMapByLocationIDs(ctx, locationIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.Competition, len(locationIDs))
		for i, locationID := range locationIDs {
			if competitions, ok := rowMap[locationID]; ok {
				res[i] = competitions
			} else {
				res[i] = []*db_model.Competition{}
			}
		}
		return res, nil
	}
}

func LoadLocationCompetitions(ctx context.Context, locationID string) ([]*db_model.Competition, error) {
	rows, err := getLoaders(ctx).LocationCompetitionsLoader.Load(ctx, locationID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
