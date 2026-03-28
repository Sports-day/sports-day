package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Sports interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error)
	Save(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)

	ListRankingRules(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.RankingRule, error)
	SetRankingRules(ctx context.Context, db *gorm.DB, sportID string, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error)
}
