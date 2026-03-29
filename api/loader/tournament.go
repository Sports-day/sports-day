package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newTournamentLoader(svc service.Tournament) func(context.Context, []string) ([]*db_model.Tournament, []error) {
	return func(ctx context.Context, ids []string) ([]*db_model.Tournament, []error) {
		rowMap, err := svc.GetTournamentsMapByIDs(ctx, ids)
		if err != nil {
			return nil, []error{err}
		}

		result := make([]*db_model.Tournament, len(ids))
		errs := make([]error, len(ids))
		for i, id := range ids {
			if t, ok := rowMap[id]; ok {
				result[i] = t
			} else {
				errs[i] = errors.ErrTournamentNotFound
			}
		}
		return result, errs
	}
}

// LoadTournaments は ID リストからトーナメントを取得する
func LoadTournaments(ctx context.Context, ids []string) ([]*db_model.Tournament, error) {
	rows, err := getLoaders(ctx).TournamentLoader.LoadAll(ctx, ids)
	if err != nil && !errors.Is(err, errors.ErrTournamentNotFound) {
		return nil, errors.Wrap(err)
	}
	return slices.Filter(rows, func(r *db_model.Tournament) bool { return r != nil }), nil
}
