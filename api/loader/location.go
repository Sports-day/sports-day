package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newLocationLoader(svc service.Location) func(context.Context, []string) ([]*db_model.Location, []error) {
	return func(ctx context.Context, locationIDs []string) ([]*db_model.Location, []error) {
		rowMap, err := svc.GetLocationMapByIDs(ctx, locationIDs)
		if err != nil {
			return nil, []error{err}
		}

		locations := make([]*db_model.Location, len(locationIDs))
		errs := make([]error, len(locationIDs))
		for i, locationID := range locationIDs {
			if location, ok := rowMap[locationID]; ok {
				locations[i] = location
			} else {
				errs[i] = errors.ErrLocationNotFound
			}
		}
		return locations, errs
	}
}

func LoadLocations(ctx context.Context, locationIDs []string) ([]*db_model.Location, error) {
	rows, err := getLoaders(ctx).LocationLoader.LoadAll(ctx, locationIDs)
	if err != nil && !errors.Is(err, errors.ErrLocationNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Location) bool {
		return row != nil
	})
	return rows, nil
}
