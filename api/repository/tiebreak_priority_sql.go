package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type tiebreakPriority struct{}

func NewTiebreakPriority() TiebreakPriority {
	return tiebreakPriority{}
}

func (r tiebreakPriority) ListByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.TiebreakPriority, error) {
	var priorities []*db_model.TiebreakPriority
	if err := db.Where("league_id = ?", leagueID).Order("priority ASC").Find(&priorities).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return priorities, nil
}
