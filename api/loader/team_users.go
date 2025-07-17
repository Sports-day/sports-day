package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newTeamUsersLoader(svc service.Team) func(context.Context, []string) ([][]*db_model.TeamUser, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.TeamUser, []error) {
		rowMap, err := svc.GetTeamUsersMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.TeamUser, len(teamIDs))
		for i, teamID := range teamIDs {
			if teamUsers, ok := rowMap[teamID]; ok {
				res[i] = teamUsers
			} else {
				res[i] = []*db_model.TeamUser{}
			}
		}
		return res, nil
	}
}

func LoadTeamUsers(ctx context.Context, teamID string) ([]*db_model.TeamUser, error) {
	rows, err := getLoaders(ctx).TeamUsersLoader.Load(ctx, teamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
