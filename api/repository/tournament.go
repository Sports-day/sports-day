package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Tournament interface {
	// Tournament CRUD
	Save(ctx context.Context, db *gorm.DB, tournament *db_model.Tournament) (*db_model.Tournament, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Tournament, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Tournament, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Tournament, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Tournament, error)
	ListByCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.Tournament, error)
	GetMainByCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) (*db_model.Tournament, error)

	// TournamentSlot CRUD
	SaveSlot(ctx context.Context, db *gorm.DB, slot *db_model.TournamentSlot) (*db_model.TournamentSlot, error)
	GetSlot(ctx context.Context, db *gorm.DB, id string) (*db_model.TournamentSlot, error)
	DeleteSlot(ctx context.Context, db *gorm.DB, id string) (*db_model.TournamentSlot, error)
	BatchGetSlots(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.TournamentSlot, error)
	ListByTournamentID(ctx context.Context, db *gorm.DB, tournamentID string) ([]*db_model.TournamentSlot, error)
	ListBySourceMatchID(ctx context.Context, db *gorm.DB, sourceMatchID string) ([]*db_model.TournamentSlot, error)
	GetByMatchEntryID(ctx context.Context, db *gorm.DB, matchEntryID string) (*db_model.TournamentSlot, error)
	BatchGetByTournamentIDs(ctx context.Context, db *gorm.DB, tournamentIDs []string) ([]*db_model.TournamentSlot, error)
	BatchGetByMatchEntryIDs(ctx context.Context, db *gorm.DB, matchEntryIDs []string) ([]*db_model.TournamentSlot, error)
	GetSeedSlot(ctx context.Context, db *gorm.DB, tournamentID string, seedNumber int64) (*db_model.TournamentSlot, error)
	ListSeedSlotsByTournamentID(ctx context.Context, db *gorm.DB, tournamentID string) ([]*db_model.TournamentSlot, error)
}
