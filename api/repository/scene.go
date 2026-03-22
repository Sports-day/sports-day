package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Scene interface {
	Save(ctx context.Context, db *gorm.DB, scene *db_model.Scene) (*db_model.Scene, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Scene, error)

	CreateSportScene(ctx context.Context, db *gorm.DB, sportScene *db_model.SportScene) (*db_model.SportScene, error)
	FindSportSceneByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error)
	FindSportSceneBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportScene, error)
	FindSportSceneBySceneID(ctx context.Context, db *gorm.DB, sceneID string) ([]*db_model.SportScene, error)
	DeleteSportScene(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error)

	CreateSportEntry(ctx context.Context, db *gorm.DB, sportEntry *db_model.SportEntry) (*db_model.SportEntry, error)
	FindSportEntryByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error)
	FindSportEntryBySportSceneID(ctx context.Context, db *gorm.DB, sportSceneID string) ([]*db_model.SportEntry, error)
	FindSportEntryByTeamID(ctx context.Context, db *gorm.DB, teamID string) ([]*db_model.SportEntry, error)
	DeleteSportEntry(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error)
}
