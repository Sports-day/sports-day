package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newSportScenesBySceneLoader(svc service.Scene) func(context.Context, []string) ([][]*db_model.SportScene, []error) {
	return func(ctx context.Context, sceneIDs []string) ([][]*db_model.SportScene, []error) {
		rowMap, err := svc.GetSportScenesMapBySceneIDs(ctx, sceneIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.SportScene, len(sceneIDs))
		for i, sceneID := range sceneIDs {
			if sportScenes, ok := rowMap[sceneID]; ok {
				res[i] = sportScenes
			} else {
				res[i] = []*db_model.SportScene{}
			}
		}
		return res, nil
	}
}

func LoadSportScenesByScene(ctx context.Context, sceneID string) ([]*db_model.SportScene, error) {
	rows, err := getLoaders(ctx).SportScenesBySceneLoader.Load(ctx, sceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
