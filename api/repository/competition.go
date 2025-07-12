package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Competition interface {
	Save(ctx context.Context, db *gorm.DB, competition *db_model.Competition) (*db_model.Competition, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Competition, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Competition, error)
	AddCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error)
	DeleteCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error)
	BatchGetCompetitionEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.CompetitionEntry, error)
	BatchGetCompetitionEntriesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.CompetitionEntry, error)
}
