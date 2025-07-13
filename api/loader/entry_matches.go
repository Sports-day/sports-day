package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newEntryMatchesLoader(svc service.Match) func(context.Context, []string) ([][]*db_model.MatchEntry, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.MatchEntry, []error) {
		rowMap, err := svc.GetMatchEntriesMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.MatchEntry, len(teamIDs))
		for i, teamID := range teamIDs {
			if matchEntries, ok := rowMap[teamID]; ok {
				res[i] = matchEntries
			} else {
				res[i] = []*db_model.MatchEntry{}
			}
		}
		return res, nil
	}
}

func LoadEntryMatches(ctx context.Context, teamID string) ([]*db_model.MatchEntry, error) {
	rows, err := getLoaders(ctx).EntryMatchesLoader.Load(ctx, teamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
