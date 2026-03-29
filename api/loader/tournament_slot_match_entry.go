package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"
)

func newSlotByMatchEntryLoader(svc service.Tournament) func(context.Context, []string) ([]*db_model.TournamentSlot, []error) {
	return func(ctx context.Context, matchEntryIDs []string) ([]*db_model.TournamentSlot, []error) {
		rowMap, err := svc.GetSlotsByMatchEntryIDs(ctx, matchEntryIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([]*db_model.TournamentSlot, len(matchEntryIDs))
		errs := make([]error, len(matchEntryIDs))
		for i, eid := range matchEntryIDs {
			result[i] = rowMap[eid]
		}
		return result, errs
	}
}

func LoadSlotByMatchEntry(ctx context.Context, matchEntryID string) (*db_model.TournamentSlot, error) {
	rows, err := getLoaders(ctx).SlotByMatchEntryLoader.LoadAll(ctx, []string{matchEntryID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 || rows[0] == nil {
		return nil, nil
	}
	return rows[0], nil
}
