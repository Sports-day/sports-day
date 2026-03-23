package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type League interface {
	Save(ctx context.Context, db *gorm.DB, league *db_model.League) (*db_model.League, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.League, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.League, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.League, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.League, error)
	ListTiebreakPrioritiesByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.TiebreakPriority, error)
	DeleteTiebreakPrioritiesByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) error
	BatchCreateTiebreakPriorities(ctx context.Context, db *gorm.DB, priorities []*db_model.TiebreakPriority) ([]*db_model.TiebreakPriority, error)
}
