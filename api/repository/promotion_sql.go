package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type promotion struct{}

func NewPromotion() Promotion {
	return promotion{}
}

func (r promotion) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error) {
	var rule db_model.PromotionRule
	if err := db.First(&rule, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrPromotionRuleNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r promotion) Save(ctx context.Context, db *gorm.DB, rule *db_model.PromotionRule) (*db_model.PromotionRule, error) {
	if err := db.Save(rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (r promotion) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error) {
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

func (r promotion) ListBySourceCompetitionID(ctx context.Context, db *gorm.DB, sourceCompetitionID string) ([]*db_model.PromotionRule, error) {
	var rules []*db_model.PromotionRule
	if err := db.Where("source_competition_id = ?", sourceCompetitionID).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r promotion) ListByTargetCompetitionID(ctx context.Context, db *gorm.DB, targetCompetitionID string) ([]*db_model.PromotionRule, error) {
	var rules []*db_model.PromotionRule
	if err := db.Where("target_competition_id = ?", targetCompetitionID).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}
