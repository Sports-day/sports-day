package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newGroupTeamsLoader(svc service.Team) func(context.Context, []string) ([][]*db_model.Team, []error) {
	return func(ctx context.Context, groupIDs []string) ([][]*db_model.Team, []error) {
		rowMap, err := svc.GetTeamsMapByGroupIDs(ctx, groupIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.Team, len(groupIDs))
		for i, groupID := range groupIDs {
			if teams, ok := rowMap[groupID]; ok {
				res[i] = teams
			} else {
				res[i] = []*db_model.Team{}
			}
		}
		return res, nil
	}
}

func LoadGroupTeams(ctx context.Context, groupID string) ([]*db_model.Team, error) {
	rows, err := getLoaders(ctx).GroupTeamsLoader.Load(ctx, groupID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
