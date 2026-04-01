package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newEntrySportScenesLoader(svc service.Scene) func(context.Context, []string) ([][]*db_model.SportEntry, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.SportEntry, []error) {
		rowMap, err := svc.GetSportEntriesMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.SportEntry, len(teamIDs))
		for i, teamID := range teamIDs {
			if sportEntries, ok := rowMap[teamID]; ok {
				res[i] = sportEntries
			} else {
				res[i] = []*db_model.SportEntry{}
			}
		}
		return res, nil
	}
}

func LoadEntrySportScenes(ctx context.Context, teamID string) ([]*db_model.SportEntry, error) {
	rows, err := getLoaders(ctx).EntrySportScenesLoader.Load(ctx, teamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
