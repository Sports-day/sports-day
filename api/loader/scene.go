package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newSceneLoader(svc service.Scene) func(context.Context, []string) ([]*db_model.Scene, []error) {
	return func(ctx context.Context, ids []string) ([]*db_model.Scene, []error) {
		rowMap, err := svc.GetScenesMapByIDs(ctx, ids)
		if err != nil {
			return nil, []error{err}
		}
		res := make([]*db_model.Scene, len(ids))
		errs := make([]error, len(ids))
		for i, id := range ids {
			if row, ok := rowMap[id]; ok {
				res[i] = row
			} else {
				errs[i] = errors.ErrSceneNotFound
			}
		}
		return res, errs
	}
}
func LoadScenes(ctx context.Context, ids []string) ([]*db_model.Scene, error) {
	rows, err := getLoaders(ctx).SceneLoader.LoadAll(ctx, ids)
	if err != nil && !errors.Is(err, errors.ErrSceneNotFound) {
		return nil, errors.Wrap(err)
	}
	return slices.Filter(rows, func(row *db_model.Scene) bool { return row != nil }), nil
}
