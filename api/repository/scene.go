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

	GetSportSceneByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error)
	GetSportSceneBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportScene, error)
	GetSportSceneBySceneID(ctx context.Context, db *gorm.DB, sceneID string) ([]*db_model.SportScene, error)
	DeleteSportScene(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error)

	AddSportScenes(ctx context.Context, db *gorm.DB, sceneID string, sportIDs []string) ([]*db_model.SportScene, error)
	DeleteSportScenes(ctx context.Context, db *gorm.DB, sceneID string, sportIDs []string) error
	AddSportEntries(ctx context.Context, db *gorm.DB, sportSceneID string, teamIDs []string) ([]*db_model.SportEntry, error)
	DeleteSportEntries(ctx context.Context, db *gorm.DB, sportSceneID string, teamIDs []string) error

	GetSportEntryByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error)
	DeleteSportEntry(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error)

	BatchGetScenesByIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Scene, error)
	BatchGetSportScenesByIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.SportScene, error)
	BatchGetSportScenesBySportIDs(ctx context.Context, db *gorm.DB, sportIDs []string) ([]*db_model.SportScene, error)
	BatchGetSportScenesBySceneIDs(ctx context.Context, db *gorm.DB, sceneIDs []string) ([]*db_model.SportScene, error)
	BatchGetSportEntriesBySportSceneIDs(ctx context.Context, db *gorm.DB, sportSceneIDs []string) ([]*db_model.SportEntry, error)
	BatchGetSportEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIDs []string) ([]*db_model.SportEntry, error)
}
