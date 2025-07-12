package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newCompetitionLoader(svc service.Competition) func(context.Context, []string) ([]*db_model.Competition, []error) {
	return func(ctx context.Context, competitionIDs []string) ([]*db_model.Competition, []error) {
		rowMap, err := svc.GetCompetitionsMapByIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}
		competitions := make([]*db_model.Competition, len(competitionIDs))
		errs := make([]error, len(competitionIDs))
		for i, competitionID := range competitionIDs {
			if competition, ok := rowMap[competitionID]; ok {
				competitions[i] = competition
			} else {
				errs[i] = errors.ErrCompetitionNotFound
			}
		}
		return competitions, errs
	}
}

func LoadCompetitions(ctx context.Context, competitionIDs []string) ([]*db_model.Competition, error) {
	rows, err := getLoaders(ctx).CompetitionLoader.LoadAll(ctx, competitionIDs)
	if err != nil && !errors.Is(err, errors.ErrCompetitionNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Competition) bool {
		return row != nil
	})

	return rows, nil
}
