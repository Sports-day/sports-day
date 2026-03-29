package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"
)

func newTournamentsByCompetitionLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.Tournament, []error) {
	return func(ctx context.Context, competitionIDs []string) ([][]*db_model.Tournament, []error) {
		rowMap, err := svc.GetTournamentsMapByCompetitionIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.Tournament, len(competitionIDs))
		errs := make([]error, len(competitionIDs))
		for i, cid := range competitionIDs {
			result[i] = rowMap[cid]
			if result[i] == nil {
				result[i] = []*db_model.Tournament{}
			}
		}
		return result, errs
	}
}

func LoadTournamentsByCompetition(ctx context.Context, competitionID string) ([]*db_model.Tournament, error) {
	rows, err := getLoaders(ctx).TournamentsByCompetitionLoader.LoadAll(ctx, []string{competitionID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return []*db_model.Tournament{}, nil
	}
	return rows[0], nil
}
