package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newMatchEntryLoader(svc service.Match) func(context.Context, []string) ([]*db_model.MatchEntry, []error) {
	return func(ctx context.Context, ids []string) ([]*db_model.MatchEntry, []error) {
		rowMap, err := svc.GetMatchEntriesMapByIDs(ctx, ids)
		if err != nil {
			return nil, []error{err}
		}

		result := make([]*db_model.MatchEntry, len(ids))
		errs := make([]error, len(ids))
		for i, id := range ids {
			if entry, ok := rowMap[id]; ok {
				result[i] = entry
			} else {
				errs[i] = errors.ErrMatchNotFound
			}
		}
		return result, errs
	}
}

func LoadMatchEntry(ctx context.Context, id string) (*db_model.MatchEntry, error) {
	rows, err := getLoaders(ctx).MatchEntryLoader.LoadAll(ctx, []string{id})
	if err != nil && !errors.Is(err, errors.ErrMatchNotFound) {
		return nil, errors.Wrap(err)
	}
	filtered := slices.Filter(rows, func(r *db_model.MatchEntry) bool { return r != nil })
	if len(filtered) == 0 {
		return nil, nil
	}
	return filtered[0], nil
}
