package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type PromotionRule interface {
	Save(ctx context.Context, db *gorm.DB, rule *db_model.PromotionRule) (*db_model.PromotionRule, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	ListBySourceCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.PromotionRule, error)
	ListByTargetCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.PromotionRule, error)
}
