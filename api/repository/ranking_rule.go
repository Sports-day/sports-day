package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type RankingRule interface {
	DeleteByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) error
	BatchCreate(ctx context.Context, db *gorm.DB, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error)
	ListByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.RankingRule, error)
	BatchGetByLeagueIDs(ctx context.Context, db *gorm.DB, leagueIDs []string) ([]*db_model.RankingRule, error)
}
