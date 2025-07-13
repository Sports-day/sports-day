package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newMatchLoader(svc service.Match) func(context.Context, []string) ([]*db_model.Match, []error) {
	return func(ctx context.Context, matchIDs []string) ([]*db_model.Match, []error) {
		rowMap, err := svc.GetMatchesMapByIDs(ctx, matchIDs)
		if err != nil {
			return nil, []error{err}
		}

		matches := make([]*db_model.Match, len(matchIDs))
		errs := make([]error, len(matchIDs))
		for i, matchID := range matchIDs {
			if match, ok := rowMap[matchID]; ok {
				matches[i] = match
			} else {
				errs[i] = errors.ErrMatchNotFound
			}
		}
		return matches, errs
	}
}

func LoadMatches(ctx context.Context, matchIDs []string) ([]*db_model.Match, error) {
	rows, err := getLoaders(ctx).MatchLoader.LoadAll(ctx, matchIDs)
	if err != nil && !errors.Is(err, errors.ErrMatchNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Match) bool {
		return row != nil
	})
	return rows, nil
}
