package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newRankingRulesLoader(svc service.League) func(context.Context, []string) ([][]*db_model.RankingRule, []error) {
	return func(ctx context.Context, leagueIDs []string) ([][]*db_model.RankingRule, []error) {
		rowMap, err := svc.GetRankingRulesMapByLeagueIDs(ctx, leagueIDs)
		if err != nil {
			return nil, []error{err}
		}

		results := make([][]*db_model.RankingRule, len(leagueIDs))
		errs := make([]error, len(leagueIDs))
		for i, leagueID := range leagueIDs {
			if rules, ok := rowMap[leagueID]; ok {
				results[i] = rules
			} else {
				results[i] = []*db_model.RankingRule{}
			}
		}
		return results, errs
	}
}

func LoadRankingRules(ctx context.Context, leagueID string) ([]*db_model.RankingRule, error) {
	results, err := getLoaders(ctx).RankingRulesLoader.Load(ctx, leagueID)
	if err != nil && !errors.Is(err, errors.ErrRankingRuleNotFound) {
		return nil, errors.Wrap(err)
	}
	if results == nil {
		return []*db_model.RankingRule{}, nil
	}
	return results, nil
}
