package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newCompetitionMatchesLoader(svc service.Match) func(context.Context, []string) ([][]*db_model.Match, []error) {
	return func(ctx context.Context, competitionIDs []string) ([][]*db_model.Match, []error) {
		rowMap, err := svc.GetMatchesMapByCompetitionIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.Match, len(competitionIDs))
		for i, competitionID := range competitionIDs {
			if matches, ok := rowMap[competitionID]; ok {
				res[i] = matches
			} else {
				res[i] = []*db_model.Match{}
			}
		}
		return res, nil
	}
}

func LoadCompetitionMatches(ctx context.Context, competitionID string) ([]*db_model.Match, error) {
	rows, err := getLoaders(ctx).CompetitionMatchesLoader.Load(ctx, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
