package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newSportRulesLoader(svc service.Rule) func(context.Context, []string) ([][]*db_model.Rule, []error) {
	return func(ctx context.Context, sportIDs []string) ([][]*db_model.Rule, []error) {
		rowMap, err := svc.GetRulesMapBySportIDs(ctx, sportIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.Rule, len(sportIDs))
		for i, sportID := range sportIDs {
			if rules, ok := rowMap[sportID]; ok {
				res[i] = rules
			} else {
				res[i] = []*db_model.Rule{}
			}
		}
		return res, nil
	}
}

func LoadSportRules(ctx context.Context, sportID string) ([]*db_model.Rule, error) {
	rows, err := getLoaders(ctx).SportRulesLoader.Load(ctx, sportID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
