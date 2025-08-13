package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type competition struct{}

func NewCompetition() Competition {
	return competition{}
}

func (r competition) Save(ctx context.Context, db *gorm.DB, competition *db_model.Competition) (*db_model.Competition, error) {
	if err := db.Save(competition).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competition, nil
}

func (r competition) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error) {
	var competition db_model.Competition
	if err := db.First(&competition, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrCompetitionNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&competition).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &competition, nil
}

func (r competition) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error) {
	var competition db_model.Competition
	if err := db.First(&competition, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrCompetitionNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &competition, nil
}

func (r competition) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Competition, error) {
	var competitions []*db_model.Competition
	if err := db.Where("id IN (?)", ids).Find(&competitions).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitions, nil
}

func (r competition) List(ctx context.Context, db *gorm.DB) ([]*db_model.Competition, error) {
	var competitions []*db_model.Competition
	if err := db.Find(&competitions).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitions, nil
}

func (r competition) AddCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error) {
	entries := make([]*db_model.CompetitionEntry, 0, len(teamIds))
	for _, teamId := range teamIds {
		entries = append(entries, &db_model.CompetitionEntry{
			CompetitionID: competitionId,
			TeamID:        teamId,
		})
	}

	if err := db.Create(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r competition) DeleteCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error) {
	var competitionEntries []*db_model.CompetitionEntry
	if err := db.Where("competition_id = ? AND team_id IN (?)", competitionId, teamIds).Find(&competitionEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	if err := db.Where("competition_id = ? AND team_id IN (?)", competitionId, teamIds).Delete(&db_model.CompetitionEntry{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitionEntries, nil
}

func (r competition) BatchGetCompetitionEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.CompetitionEntry, error) {
	var competitionEntries []*db_model.CompetitionEntry
	if err := db.Where("team_id IN (?)", teamIds).Find(&competitionEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitionEntries, nil
}

func (r competition) BatchGetCompetitionEntriesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.CompetitionEntry, error) {
	var competitionEntries []*db_model.CompetitionEntry
	if err := db.Where("competition_id IN (?)", competitionIds).Find(&competitionEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitionEntries, nil
}

func (r competition) BatchGetByLocationIDs(ctx context.Context, db *gorm.DB, locationIDs []string) ([]*db_model.Competition, error) {
	var competitions []*db_model.Competition
	if err := db.Where("default_location_id IN ?", locationIDs).Find(&competitions).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return competitions, nil
}
