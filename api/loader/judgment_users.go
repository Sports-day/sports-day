package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newUserJudgmentsLoader(svc service.Judgment) func(context.Context, []string) ([][]*db_model.Judgment, []error) {
	return func(ctx context.Context, userIDs []string) ([][]*db_model.Judgment, []error) {
		rowMap, err := svc.GetJudgmentsMapByUserIDs(ctx, userIDs)
		if err != nil {
			return nil, []error{err}
		}

		res := make([][]*db_model.Judgment, len(userIDs))
		for i, userID := range userIDs {
			if judgments, ok := rowMap[userID]; ok {
				res[i] = judgments
			} else {
				res[i] = []*db_model.Judgment{}
			}
		}
		return res, nil
	}
}

func LoadUserJudgments(ctx context.Context, userID string) ([]*db_model.Judgment, error) {
	rows, err := getLoaders(ctx).UserJudgmentsLoader.Load(ctx, userID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
