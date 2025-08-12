package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/service"
)

func newJudgmentLoader(svc service.Judgment) func(context.Context, []string) ([]*db_model.Judgment, []error) {
	return func(ctx context.Context, judgmentIDs []string) ([]*db_model.Judgment, []error) {
		rowMap, err := svc.GetJudgmentMapByIDs(ctx, judgmentIDs)
		if err != nil {
			return nil, []error{err}
		}

		judgments := make([]*db_model.Judgment, len(judgmentIDs))
		errs := make([]error, len(judgmentIDs))
		for i, judgmentID := range judgmentIDs {
			if judgment, ok := rowMap[judgmentID]; ok {
				judgments[i] = judgment
			} else {
				judgments[i] = nil
				errs[i] = nil
			}
		}
		return judgments, errs
	}
}

func LoadJudgments(ctx context.Context, judgmentIDs []string) ([]*db_model.Judgment, error) {
	rows, err := getLoaders(ctx).JudgmentLoader.LoadAll(ctx, judgmentIDs)
	if err != nil && !errors.Is(err, errors.ErrJudgmentNotFound) {
		return nil, errors.Wrap(err)
	}

	rows = slices.Filter(rows, func(row *db_model.Judgment) bool {
		return row != nil
	})
	return rows, nil
}
