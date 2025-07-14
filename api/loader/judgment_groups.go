package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newGroupJudgmentsLoader(svc service.Judgment) func(context.Context, []string) ([][]*db_model.Judgment, []error) {
	return func(ctx context.Context, groupIDs []string) ([][]*db_model.Judgment, []error) {
		rowMap, err := svc.GetJudgmentsMapByGroupIDs(ctx, groupIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.Judgment, len(groupIDs))
		for i, groupID := range groupIDs {
			if judgments, ok := rowMap[groupID]; ok {
				res[i] = judgments
			} else {
				res[i] = []*db_model.Judgment{}
			}
		}
		return res, nil
	}
}

func LoadGroupJudgments(ctx context.Context, groupID string) ([]*db_model.Judgment, error) {
	rows, err := getLoaders(ctx).GroupJudgmentsLoader.Load(ctx, groupID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
