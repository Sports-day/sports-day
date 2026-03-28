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

func newTournamentsByCompetitionLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.Tournament, []error) {
	return func(ctx context.Context, competitionIDs []string) ([][]*db_model.Tournament, []error) {
		rowMap, err := svc.GetTournamentsMapByCompetitionIDs(ctx, competitionIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.Tournament, len(competitionIDs))
		errs := make([]error, len(competitionIDs))
		for i, cid := range competitionIDs {
			result[i] = rowMap[cid]
			if result[i] == nil {
				result[i] = []*db_model.Tournament{}
			}
		}
		return result, errs
	}
}

func LoadTournamentsByCompetition(ctx context.Context, competitionID string) ([]*db_model.Tournament, error) {
	rows, err := getLoaders(ctx).TournamentsByCompetitionLoader.LoadAll(ctx, []string{competitionID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return []*db_model.Tournament{}, nil
	}
	return rows[0], nil
}

func newSlotsByTournamentLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.TournamentSlot, []error) {
	return func(ctx context.Context, tournamentIDs []string) ([][]*db_model.TournamentSlot, []error) {
		rowMap, err := svc.GetSlotsByTournamentIDs(ctx, tournamentIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.TournamentSlot, len(tournamentIDs))
		errs := make([]error, len(tournamentIDs))
		for i, tid := range tournamentIDs {
			result[i] = rowMap[tid]
			if result[i] == nil {
				result[i] = []*db_model.TournamentSlot{}
			}
		}
		return result, errs
	}
}

func LoadSlotsByTournament(ctx context.Context, tournamentID string) ([]*db_model.TournamentSlot, error) {
	rows, err := getLoaders(ctx).SlotsByTournamentLoader.LoadAll(ctx, []string{tournamentID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return []*db_model.TournamentSlot{}, nil
	}
	return rows[0], nil
}

func newSlotByMatchEntryLoader(svc service.Tournament) func(context.Context, []string) ([]*db_model.TournamentSlot, []error) {
	return func(ctx context.Context, matchEntryIDs []string) ([]*db_model.TournamentSlot, []error) {
		rowMap, err := svc.GetSlotsByMatchEntryIDs(ctx, matchEntryIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([]*db_model.TournamentSlot, len(matchEntryIDs))
		errs := make([]error, len(matchEntryIDs))
		for i, eid := range matchEntryIDs {
			result[i] = rowMap[eid]
		}
		return result, errs
	}
}

func LoadSlotByMatchEntry(ctx context.Context, matchEntryID string) (*db_model.TournamentSlot, error) {
	rows, err := getLoaders(ctx).SlotByMatchEntryLoader.LoadAll(ctx, []string{matchEntryID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 || rows[0] == nil {
		return nil, nil
	}
	return rows[0], nil
}

func newMatchesByTournamentLoader(svc service.Tournament) func(context.Context, []string) ([][]*db_model.Match, []error) {
	return func(ctx context.Context, tournamentIDs []string) ([][]*db_model.Match, []error) {
		rowMap, err := svc.GetMatchesByTournamentIDs(ctx, tournamentIDs)
		if err != nil {
			return nil, []error{err}
		}

		result := make([][]*db_model.Match, len(tournamentIDs))
		errs := make([]error, len(tournamentIDs))
		for i, tid := range tournamentIDs {
			result[i] = rowMap[tid]
			if result[i] == nil {
				result[i] = []*db_model.Match{}
			}
		}
		return result, errs
	}
}

func LoadMatchesByTournament(ctx context.Context, tournamentID string) ([]*db_model.Match, error) {
	rows, err := getLoaders(ctx).MatchesByTournamentLoader.LoadAll(ctx, []string{tournamentID})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return []*db_model.Match{}, nil
	}
	return rows[0], nil
}

// LoadTournaments は ID リストからトーナメントを取得する（Loader 未使用、直接取得）
func LoadTournaments(ctx context.Context, ids []string) ([]*db_model.Tournament, error) {
	rows, err := getLoaders(ctx).TournamentLoader.LoadAll(ctx, ids)
	if err != nil {
		return nil, err
	}
	return slices.Filter(rows, func(r *db_model.Tournament) bool { return r != nil }), nil
}
