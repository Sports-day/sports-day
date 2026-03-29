package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"
)

func newMatchesByTournamentLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.Match, []error) {
	return func(ctx context.Context, tournamentIDs []string) ([][]*db_model.Match, []error) {
		rowMap, err := svc.GetMatchesByTournamentIDs(ctx, tournamentIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.Match, len(tournamentIDs))
		errs := make([]error, len(tournamentIDs))
		for i, tid := range tournamentIDs {
			result[i] = rowMap[tid]
			if result[i] == nil {
				result[i] = []*db_model.Match{}
			}
		}
		return result, errs
	}
}

func LoadMatchesByTournament(ctx context.Context, tournamentID string) ([]*db_model.Match, error) {
	rows, err := getLoaders(ctx).MatchesByTournamentLoader.Load(ctx, tournamentID)
	if err != nil {
		return nil, err
	}
	return rows, nil
}
