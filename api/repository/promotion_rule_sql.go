package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type promotionRule struct{}

func NewPromotionRule() PromotionRule {
	return promotionRule{}
}

func (r promotionRule) Save(ctx context.Context, db *gorm.DB, rule *db_model.PromotionRule) (*db_model.PromotionRule, error) {
	if err := db.Save(rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (r promotionRule) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error) {
	var rule db_model.PromotionRule
	if err := db.First(&rule, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrPromotionRuleNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r promotionRule) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error) {
	var rule db_model.PromotionRule
	if err := db.First(&rule, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrPromotionRuleNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.Delete(&rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r promotionRule) ListBySourceCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.PromotionRule, error) {
	var rules []*db_model.PromotionRule
	if err := db.Where("source_competition_id = ?", competitionID).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r promotionRule) ListByTargetCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.PromotionRule, error) {
	var rules []*db_model.PromotionRule
	if err := db.Where("target_competition_id = ?", competitionID).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}
