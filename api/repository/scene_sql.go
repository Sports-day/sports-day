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
	if err := db.Delete(&scene).Error; err != nil {
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
	if err := db.Find(&scenes).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return scenes, nil
}
