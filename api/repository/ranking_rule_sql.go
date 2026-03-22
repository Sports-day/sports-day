package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type rankingRule struct{}

func NewRankingRule() RankingRule {
	return rankingRule{}
}

func (r rankingRule) DeleteByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) error {
	if err := db.Where("league_id = ?", leagueID).Delete(&db_model.RankingRule{}).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r rankingRule) BatchCreate(ctx context.Context, db *gorm.DB, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error) {
	if len(rules) == 0 {
		return rules, nil
	}
	if err := db.Create(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r rankingRule) ListByLeagueID(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.RankingRule, error) {
	var rules []*db_model.RankingRule
	if err := db.Where("league_id = ?", leagueID).Order("priority ASC").Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}
