package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type TiebreakPriority interface {
	ListByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.TiebreakPriority, error)
}
