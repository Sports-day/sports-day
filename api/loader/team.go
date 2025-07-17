package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newTeamLoader(svc service.Team) func(context.Context, []string) ([]*db_model.Team, []error) {
	return func(ctx context.Context, teamIDs []string) ([]*db_model.Team, []error) {
		rowMap, err := svc.GetTeamsMapByIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}
		teams := make([]*db_model.Team, len(teamIDs))
		errs := make([]error, len(teamIDs))
		for i, teamID := range teamIDs {
			if team, ok := rowMap[teamID]; ok {
				teams[i] = team
			} else {
				errs[i] = errors.ErrTeamNotFound
			}
		}
		return teams, errs
	}
}

func LoadTeams(ctx context.Context, teamIDs []string) ([]*db_model.Team, error) {
	rows, err := getLoaders(ctx).TeamLoader.LoadAll(ctx, teamIDs)
	if err != nil && !errors.Is(err, errors.ErrTeamNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Team) bool {
		return row != nil
	})

	return rows, nil
}
