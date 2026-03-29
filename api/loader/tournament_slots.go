package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"
)

func newSlotsByTournamentLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.TournamentSlot, []error) {
	return func(ctx context.Context, tournamentIDs []string) ([][]*db_model.TournamentSlot, []error) {
		rowMap, err := svc.GetSlotsByTournamentIDs(ctx, tournamentIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.TournamentSlot, len(tournamentIDs))
		errs := make([]error, len(tournamentIDs))
		for i, tid := range tournamentIDs {
			result[i] = rowMap[tid]
			if result[i] == nil {
				result[i] = []*db_model.TournamentSlot{}
			}
		}
		return result, errs
	}
}

func LoadSlotsByTournament(ctx context.Context, tournamentID string) ([]*db_model.TournamentSlot, error) {
	rows, err := getLoaders(ctx).SlotsByTournamentLoader.Load(ctx, tournamentID)
	if err != nil {
		return nil, err
	}
	return rows, nil
}
