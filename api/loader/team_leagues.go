package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newTeamLeaguesLoader(svc service.League) func(context.Context, []string) ([][]*db_model.LeagueStanding, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.LeagueStanding, []error) {
		rowMap, err := svc.GetStandingsMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.LeagueStanding, len(teamIDs))
		for i, teamID := range teamIDs {
			if standings, ok := rowMap[teamID]; ok {
				res[i] = standings
			} else {
				res[i] = []*db_model.LeagueStanding{}
			}
		}
		return res, nil
	}
}

func LoadTeamLeagues(ctx context.Context, teamID string) ([]*db_model.LeagueStanding, error) {
	rows, err := getLoaders(ctx).TeamLeaguesLoader.Load(ctx, teamID)
	if err != nil && !errors.Is(err, errors.ErrLeagueNotFound) {
		return nil, errors.Wrap(err)
	}
	if rows == nil {
		return []*db_model.LeagueStanding{}, nil
	}
	return rows, nil
}
