package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newUserTeamsLoader(svc service.Team) func(context.Context, []string) ([][]*db_model.TeamUser, []error) {
	return func(ctx context.Context, userIDs []string) ([][]*db_model.TeamUser, []error) {
		rowMap, err := svc.GetTeamUsersMapByUserIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.TeamUser, len(userIDs))
		for i, userID := range userIDs {
			if teamUsers, ok := rowMap[userID]; ok {
				res[i] = teamUsers
			} else {
				res[i] = []*db_model.TeamUser{}
			}
		}
		return res, nil
	}
}

func LoadUserTeams(ctx context.Context, userID string) ([]*db_model.TeamUser, error) {
	rows, err := getLoaders(ctx).UserTeamsLoader.Load(ctx, userID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
