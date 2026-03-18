package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type scene struct{}

func NewScene() Scene {
	return scene{}
}

func (r scene) Save(ctx context.Context, db *gorm.DB, scene *db_model.Scene) (*db_model.Scene, error) {
	if err := db.Save(scene).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return scene, nil
}

func (r scene) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error) {
	var scene db_model.Scene
	if err := db.First(&scene, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSceneNotFound
		}
		return nil, errors.Wrap(err)
	}
	scene.IsDeleted = true
	if err := db.Save(&scene).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &scene, nil
}

func (r scene) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error) {
	var scene db_model.Scene
	if err := db.First(&scene, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSceneNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &scene, nil
}

func (r scene) List(ctx context.Context, db *gorm.DB) ([]*db_model.Scene, error) {
	var scenes []*db_model.Scene
	if err := db.Where("is_deleted = ?", false).Find(&scenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return scenes, nil
}

func (r scene) CreateSportScene(ctx context.Context, db *gorm.DB, sportScene *db_model.SportScene) (*db_model.SportScene, error) {
	if err := db.Create(sportScene).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}

func (r scene) FindSportSceneByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error) {
	var sportScene db_model.SportScene
	if err := db.First(&sportScene, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportSceneNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sportScene, nil
}

func (r scene) FindSportSceneBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("sport_id = ?", sportID).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}

func (r scene) FindSportSceneBySceneID(ctx context.Context, db *gorm.DB, sceneID string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("scene_id = ?", sceneID).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}
func (r scene) DeleteSportScene(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error) {
	var sportScene db_model.SportScene
	if err := db.First(&sportScene, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportSceneNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&sportScene).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sportScene, nil
}

func (r scene) CreateSportEntry(ctx context.Context, db *gorm.DB, sportEntry *db_model.SportEntry) (*db_model.SportEntry, error) {
	if err := db.Create(sportEntry).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntry, nil
}

func (r scene) FindSportEntryByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error) {
	var sportEntry db_model.SportEntry
	if err := db.First(&sportEntry, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportEntryNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sportEntry, nil
}

func (r scene) FindSportEntryBySportSceneID(ctx context.Context, db *gorm.DB, sportSceneID string) ([]*db_model.SportEntry, error) {
	var sportEntries []*db_model.SportEntry
	if err := db.Where("sport_scene_id = ?", sportSceneID).Find(&sportEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntries, nil
}

func (r scene) FindSportEntryByTeamID(ctx context.Context, db *gorm.DB, teamID string) ([]*db_model.SportEntry, error) {
	var sportEntries []*db_model.SportEntry
	if err := db.Where("team_id = ?", teamID).Find(&sportEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntries, nil
}

func (r scene) DeleteSportEntry(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error) {
	var sportEntry db_model.SportEntry
	if err := db.First(&sportEntry, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportEntryNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&sportEntry).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sportEntry, nil
}
