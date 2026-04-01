package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"

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
	if err := db.First(&scene, "id = ? AND is_deleted = ?", id, false).Error; err != nil {
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

func (r scene) GetSportSceneByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportScene, error) {
	var sportScene db_model.SportScene
	if err := db.First(&sportScene, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportSceneNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sportScene, nil
}

func (r scene) GetSportSceneBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("sport_id = ?", sportID).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}

func (r scene) GetSportSceneBySceneID(ctx context.Context, db *gorm.DB, sceneID string) ([]*db_model.SportScene, error) {
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

func (r scene) AddSportScenes(ctx context.Context, db *gorm.DB, sceneID string, sportIDs []string) ([]*db_model.SportScene, error) {
	entries := make([]*db_model.SportScene, 0, len(sportIDs))
	for _, sportID := range sportIDs {
		entries = append(entries, &db_model.SportScene{
			ID:      ulid.Make(),
			SportID: sportID,
			SceneID: sceneID,
		})
	}
	if err := db.Create(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r scene) DeleteSportScenes(ctx context.Context, db *gorm.DB, sceneID string, sportIDs []string) error {
	if err := db.Where("scene_id = ? AND sport_id IN ?", sceneID, sportIDs).Delete(&db_model.SportScene{}).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r scene) AddSportEntries(ctx context.Context, db *gorm.DB, sportSceneID string, teamIDs []string) ([]*db_model.SportEntry, error) {
	entries := make([]*db_model.SportEntry, 0, len(teamIDs))
	for _, teamID := range teamIDs {
		entries = append(entries, &db_model.SportEntry{
			ID:           ulid.Make(),
			SportSceneID: sportSceneID,
			TeamID:       teamID,
		})
	}
	if err := db.Create(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r scene) DeleteSportEntries(ctx context.Context, db *gorm.DB, sportSceneID string, teamIDs []string) error {
	if err := db.Where("sport_scene_id = ? AND team_id IN ?", sportSceneID, teamIDs).Delete(&db_model.SportEntry{}).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r scene) GetSportEntryByID(ctx context.Context, db *gorm.DB, id string) (*db_model.SportEntry, error) {
	var sportEntry db_model.SportEntry
	if err := db.First(&sportEntry, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportEntryNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sportEntry, nil
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

func (r scene) BatchGetScenesByIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Scene, error) {
	var scenes []*db_model.Scene
	if err := db.Where("id IN (?) AND is_deleted = ?", ids, false).Find(&scenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return scenes, nil
}

func (r scene) BatchGetSportScenesByIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("id IN (?)", ids).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}

func (r scene) BatchGetSportScenesBySportIDs(ctx context.Context, db *gorm.DB, sportIDs []string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("sport_id IN (?)", sportIDs).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}

func (r scene) BatchGetSportScenesBySceneIDs(ctx context.Context, db *gorm.DB, sceneIDs []string) ([]*db_model.SportScene, error) {
	var sportScenes []*db_model.SportScene
	if err := db.Where("scene_id IN ?", sceneIDs).Find(&sportScenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScenes, nil
}

func (r scene) BatchGetSportEntriesBySportSceneIDs(ctx context.Context, db *gorm.DB, sportSceneIDs []string) ([]*db_model.SportEntry, error) {
	var sportEntries []*db_model.SportEntry
	if err := db.Where("sport_scene_id IN ?", sportSceneIDs).Find(&sportEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntries, nil
}

func (r scene) BatchGetSportEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIDs []string) ([]*db_model.SportEntry, error) {
	var sportEntries []*db_model.SportEntry
	if err := db.Where("team_id IN ?", teamIDs).Find(&sportEntries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntries, nil
}
