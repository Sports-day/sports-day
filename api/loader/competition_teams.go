package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newCompetitionEntriesLoader(svc service.Competition) func(context.Context, []string) ([][]*db_model.CompetitionEntry, []error) {
	return func(ctx context.Context, competitionIDs []string) ([][]*db_model.CompetitionEntry, []error) {
		rowMap, err := svc.GetCompetitionEntriesMapByCompetitionIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.CompetitionEntry, len(competitionIDs))
		for i, competitionID := range competitionIDs {
			if competitionEntries, ok := rowMap[competitionID]; ok {
				res[i] = competitionEntries
			} else {
				res[i] = []*db_model.CompetitionEntry{}
			}
		}
		return res, nil
	}
}

func LoadCompetitionEntries(ctx context.Context, competitionID string) ([]*db_model.CompetitionEntry, error) {
	rows, err := getLoaders(ctx).CompetitionEntriesLoader.Load(ctx, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return rows, nil
}
