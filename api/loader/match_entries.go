package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newMatchEntriesLoader(svc service.Match) func(context.Context, []string) ([][]*db_model.MatchEntry, []error) {
	return func(ctx context.Context, matchIDs []string) ([][]*db_model.MatchEntry, []error) {
		rowMap, err := svc.GetMatchEntriesMapByMatchIDs(ctx, matchIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.MatchEntry, len(matchIDs))
		for i, matchID := range matchIDs {
			if matchEntries, ok := rowMap[matchID]; ok {
				res[i] = matchEntries
			} else {
				res[i] = []*db_model.MatchEntry{}
			}
		}
		return res, nil
	}
}

func LoadMatchEntries(ctx context.Context, matchID string) ([]*db_model.MatchEntry, error) {
	rows, err := getLoaders(ctx).MatchEntriesLoader.Load(ctx, matchID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
