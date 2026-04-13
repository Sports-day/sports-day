package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type league struct{}

func NewLeague() League {
	return league{}
}

func (r league) Save(ctx context.Context, db *gorm.DB, league *db_model.League) (*db_model.League, error) {
	if err := db.WithContext(ctx).Save(league).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return league, nil
}

func (r league) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.League, error) {
	var league db_model.League
	if err := db.WithContext(ctx).First(&league, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLeagueNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &league, nil
}

func (r league) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.League, error) {
	var league db_model.League
	if err := db.WithContext(ctx).First(&league, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLeagueNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.WithContext(ctx).Delete(&league).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &league, nil
}

func (r league) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.League, error) {
	var leagues []*db_model.League
	if err := db.WithContext(ctx).Where("id IN (?)", ids).Find(&leagues).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return leagues, nil
}

func (r league) List(ctx context.Context, db *gorm.DB) ([]*db_model.League, error) {
	var leagues []*db_model.League
	if err := db.WithContext(ctx).Find(&leagues).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return leagues, nil
}

func (r league) ListTiebreakPriorities(ctx context.Context, db *gorm.DB, leagueID string) ([]*db_model.TiebreakPriority, error) {
	var priorities []*db_model.TiebreakPriority
	if err := db.WithContext(ctx).Where("league_id = ?", leagueID).Order("priority ASC").Find(&priorities).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return priorities, nil
}

func (r league) SetTiebreakPriorities(ctx context.Context, db *gorm.DB, leagueID string, priorities []*db_model.TiebreakPriority) ([]*db_model.TiebreakPriority, error) {
	if len(priorities) == 0 {
		return priorities, nil
	}
	teamIDs := make([]string, len(priorities))
	for i, p := range priorities {
		teamIDs[i] = p.TeamID
	}
	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("league_id = ? AND team_id IN (?)", leagueID, teamIDs).Delete(&db_model.TiebreakPriority{}).Error; err != nil {
			return err
		}
		if err := tx.Create(&priorities).Error; err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return priorities, nil
}
