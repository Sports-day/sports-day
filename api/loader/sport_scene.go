package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newSportSceneLoader(svc service.Scene) func(context.Context, []string) ([]*db_model.SportScene, []error) {
	return func(ctx context.Context, sportSceneIDs []string) ([]*db_model.SportScene, []error) {
		rowMap, err := svc.GetSportScenesMapByIDs(ctx, sportSceneIDs)
		if err != nil {
			return nil, []error{err}
		}
		sportScenes := make([]*db_model.SportScene, len(sportSceneIDs))
		errs := make([]error, len(sportSceneIDs))
		for i, sportSceneID := range sportSceneIDs {
			if sportScene, ok := rowMap[sportSceneID]; ok {
				sportScenes[i] = sportScene
			} else {
				errs[i] = errors.ErrSportSceneNotFound
			}
		}
		return sportScenes, errs
	}
}

func LoadSportScenes(ctx context.Context, sportSceneIDs []string) ([]*db_model.SportScene, error) {
	rows, err := getLoaders(ctx).SportSceneLoader.LoadAll(ctx, sportSceneIDs)
	if err != nil && !errors.Is(err, errors.ErrSportSceneNotFound) {
		return nil, errors.Wrap(err)
	}
	rows = slices.Filter(rows, func(row *db_model.SportScene) bool { return row != nil })
	return rows, nil
}
