package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newLeagueLoader(svc service.League) func(context.Context, []string) ([]*db_model.League, []error) {
	return func(ctx context.Context, leagueIDs []string) ([]*db_model.League, []error) {
		rowMap, err := svc.GetLeaguesMapByIDs(ctx, leagueIDs)
		if err != nil {
			return nil, []error{err}
		}

		leagues := make([]*db_model.League, len(leagueIDs))
		errs := make([]error, len(leagueIDs))
		for i, leagueID := range leagueIDs {
			if league, ok := rowMap[leagueID]; ok {
				leagues[i] = league
			} else {
				errs[i] = errors.ErrLeagueNotFound
			}
		}
		return leagues, errs
	}
}

func LoadLeagues(ctx context.Context, leagueIDs []string) ([]*db_model.League, error) {
	rows, err := getLoaders(ctx).LeagueLoader.LoadAll(ctx, leagueIDs)
	if err != nil && !errors.Is(err, errors.ErrLeagueNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.League) bool {
		return row != nil
	})
	return rows, nil
}
