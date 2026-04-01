package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newSportEntriesLoader(svc service.Scene) func(context.Context, []string) ([][]*db_model.SportEntry, []error) {
	return func(ctx context.Context, sportSceneIDs []string) ([][]*db_model.SportEntry, []error) {
		rowMap, err := svc.GetSportEntriesMapBySportSceneIDs(ctx, sportSceneIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.SportEntry, len(sportSceneIDs))
		for i, sportSceneID := range sportSceneIDs {
			if sportEntries, ok := rowMap[sportSceneID]; ok {
				res[i] = sportEntries
			} else {
				res[i] = []*db_model.SportEntry{}
			}
		}
		return res, nil
	}
}

func LoadSportEntries(ctx context.Context, sportSceneID string) ([]*db_model.SportEntry, error) {
	rows, err := getLoaders(ctx).SportEntriesLoader.Load(ctx, sportSceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
