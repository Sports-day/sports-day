package graph

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
)

// roleToString は model.Role を DB 保存用の文字列に変換する。
func roleToString(role model.Role) string {
	switch role {
	case model.RoleAdmin:
		return "admin"
	case model.RoleOrganizer:
		return "organizer"
	default:
		return "participant"
	}
}

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
