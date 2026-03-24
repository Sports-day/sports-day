package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newSportScenesBySportLoader(svc service.Scene) func(context.Context, []string) ([][]*db_model.SportScene, []error) {
	return func(ctx context.Context, sportIDs []string) ([][]*db_model.SportScene, []error) {
		rowMap, err := svc.GetSportScenesMapBySportIDs(ctx, sportIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.SportScene, len(sportIDs))
		for i, sportID := range sportIDs {
			if sportScenes, ok := rowMap[sportID]; ok {
				res[i] = sportScenes
			} else {
				res[i] = []*db_model.SportScene{}
			}
		}
		return res, nil
	}
}

func LoadSportScenesBySport(ctx context.Context, sportID string) ([]*db_model.SportScene, error) {
	rows, err := getLoaders(ctx).SportScenesBySportLoader.Load(ctx, sportID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
