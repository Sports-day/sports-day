package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Match interface {
	Save(ctx context.Context, db *gorm.DB, match *db_model.Match) (*db_model.Match, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Match, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Match, error)
	AddMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error)
	DeleteMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error)
	UpdateMatchEntryScore(ctx context.Context, db *gorm.DB, matchId string, teamId string, score int) (*db_model.MatchEntry, error)
	BatchGetMatchEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.MatchEntry, error)
	BatchGetMatchEntriesByMatchIDs(ctx context.Context, db *gorm.DB, matchIds []string) ([]*db_model.MatchEntry, error)
	BatchGetMatchesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.Match, error)
	BatchGetMatchesByLocationIDs(ctx context.Context, db *gorm.DB, locationIds []string) ([]*db_model.Match, error)
}
