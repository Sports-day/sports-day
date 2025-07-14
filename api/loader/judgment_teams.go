package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newTeamJudgmentsLoader(svc service.Judgment) func(context.Context, []string) ([][]*db_model.Judgment, []error) {
	return func(ctx context.Context, teamIDs []string) ([][]*db_model.Judgment, []error) {
		rowMap, err := svc.GetJudgmentsMapByTeamIDs(ctx, teamIDs)
		if err != nil {
			return nil, []error{err}
		}
		res := make([][]*db_model.Judgment, len(teamIDs))
		for i, teamID := range teamIDs {
			if judgments, ok := rowMap[teamID]; ok {
				res[i] = judgments
			} else {
				res[i] = []*db_model.Judgment{}
			}
		}
		return res, nil
	}
}

func LoadTeamJudgments(ctx context.Context, teamID string) ([]*db_model.Judgment, error) {
	rows, err := getLoaders(ctx).TeamJudgmentsLoader.Load(ctx, teamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rows, nil
}
