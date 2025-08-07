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

	SaveStanding(ctx context.Context, db *gorm.DB, standing *db_model.LeagueStanding) (*db_model.LeagueStanding, error)
	GetStanding(ctx context.Context, db *gorm.DB, id string, teamID string) (*db_model.LeagueStanding, error)
	DeleteStanding(ctx context.Context, db *gorm.DB, id, teamID string) (*db_model.LeagueStanding, error)
	ListStandings(ctx context.Context, db *gorm.DB, id string) ([]*db_model.LeagueStanding, error)

	BatchGetStandingsByCompetitionIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.LeagueStanding, error)
	BatchGetStandingsByTeamIDs(ctx context.Context, db *gorm.DB, teamIDs []string) ([]*db_model.LeagueStanding, error)
}
