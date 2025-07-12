package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newEntryCompetitionsLoader(svc service.Competition) func(context.Context, []string) ([][]*db_model.CompetitionEntry, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.CompetitionEntry, []error) {
		rowMap, err := svc.GetCompetitionEntriesMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.CompetitionEntry, len(teamIDs))
		for i, teamID := range teamIDs {
			if competitionEntries, ok := rowMap[teamID]; ok {
				res[i] = competitionEntries
			} else {
				res[i] = []*db_model.CompetitionEntry{}
			}
		}
		return res, nil
	}
}

func LoadEntryCompetitions(ctx context.Context, teamID string) ([]*db_model.CompetitionEntry, error) {
	rows, err := getLoaders(ctx).EntryCompetitionsLoader.Load(ctx, teamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return rows, nil
}
