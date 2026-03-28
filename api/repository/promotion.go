package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Promotion interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	Save(ctx context.Context, db *gorm.DB, rule *db_model.PromotionRule) (*db_model.PromotionRule, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	ListBySourceCompetitionID(ctx context.Context, db *gorm.DB, sourceCompetitionID string) ([]*db_model.PromotionRule, error)
	ListByTargetCompetitionID(ctx context.Context, db *gorm.DB, targetCompetitionID string) ([]*db_model.PromotionRule, error)
}
