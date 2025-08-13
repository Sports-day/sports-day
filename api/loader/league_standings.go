package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newLeagueStandingsLoader(svc service.League) func(context.Context, []string) ([][]*db_model.LeagueStanding, []error) {
	return func(ctx context.Context, competitionIDs []string) ([][]*db_model.LeagueStanding, []error) {
		rowMap, err := svc.GetStandingsMapByCompetitionIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.LeagueStanding, len(competitionIDs))
		for i, competitionID := range competitionIDs {
			if standings, ok := rowMap[competitionID]; ok {
				res[i] = standings
			} else {
				res[i] = []*db_model.LeagueStanding{}
			}
		}
		return res, nil
	}
}

func LoadLeagueStandings(ctx context.Context, competitionID string) ([]*db_model.LeagueStanding, error) {
	rows, err := getLoaders(ctx).LeagueStandingsLoader.Load(ctx, competitionID)
	if err != nil && !errors.Is(err, errors.ErrLeagueNotFound) {
		return nil, errors.Wrap(err)
	}
	if rows == nil {
		return []*db_model.LeagueStanding{}, nil
	}
	return rows, nil
}
