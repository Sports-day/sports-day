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
	if err := db.Save(league).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return league, nil
}

func (r league) Get(ctx context.Context, db *gorm.DB, competitionID string) (*db_model.League, error) {
	var league db_model.League
	if err := db.First(&league, "competition_id = ?", competitionID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLeagueNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &league, nil
}

func (r league) BatchGet(ctx context.Context, db *gorm.DB, competitionIDs []string) ([]*db_model.League, error) {
	var leagues []*db_model.League
	if err := db.Where("competition_id IN (?)", competitionIDs).Find(&leagues).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return leagues, nil
}

func (r league) List(ctx context.Context, db *gorm.DB) ([]*db_model.League, error) {
	var leagues []*db_model.League
	if err := db.Find(&leagues).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return leagues, nil
}

func (r league) SaveStanding(ctx context.Context, db *gorm.DB, standing *db_model.LeagueStanding) (*db_model.LeagueStanding, error) {
	if err := db.Save(standing).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return standing, nil
}

func (r league) GetStanding(ctx context.Context, db *gorm.DB, competitionID, teamID string) (*db_model.LeagueStanding, error) {
	var standing db_model.LeagueStanding
	if err := db.First(&standing, "competition_id = ? AND team_id = ?", competitionID, teamID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLeagueStandingNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &standing, nil
}

func (r league) ListStandings(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.LeagueStanding, error) {
	var standings []*db_model.LeagueStanding
	if err := db.Where("competition_id = ?", competitionID).Find(&standings).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return standings, nil
}

func (r league) BatchGetStandingsByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIDs []string) ([]*db_model.LeagueStanding, error) {
	var standings []*db_model.LeagueStanding
	if err := db.Where("competition_id IN (?)", competitionIDs).Find(&standings).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return standings, nil
}

func (r league) BatchGetStandingsByTeamIDs(ctx context.Context, db *gorm.DB, teamIDs []string) ([]*db_model.LeagueStanding, error) {
	var standings []*db_model.LeagueStanding
	if err := db.Where("team_id IN (?)", teamIDs).Find(&standings).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return standings, nil
}
