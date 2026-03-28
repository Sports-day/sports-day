package graph

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
)

func (r *mutationResolver) formatPromotionRule(ctx context.Context, rule *db_model.PromotionRule) (*model.PromotionRule, error) {
	sourceComp, err := r.CompetitionService.Get(ctx, rule.SourceCompetitionID)
	if err != nil {
		return nil, err
	}
	targetComp, err := r.CompetitionService.Get(ctx, rule.TargetCompetitionID)
	if err != nil {
		return nil, err
	}
	return model.FormatPromotionRuleResponse(rule, sourceComp, targetComp), nil
}

func (r *queryResolver) formatPromotionRuleFromQuery(ctx context.Context, rule *db_model.PromotionRule) (*model.PromotionRule, error) {
	sourceComp, err := r.CompetitionService.Get(ctx, rule.SourceCompetitionID)
	if err != nil {
		return nil, err
	}
	targetComp, err := r.CompetitionService.Get(ctx, rule.TargetCompetitionID)
	if err != nil {
		return nil, err
	}
	return model.FormatPromotionRuleResponse(rule, sourceComp, targetComp), nil
}
