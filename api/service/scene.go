package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Scene struct {
	db        *gorm.DB
	sceneRepo repository.Scene
}

func NewScene(db *gorm.DB, sceneRepo repository.Scene) Scene {
	return Scene{
		db:        db,
		sceneRepo: sceneRepo,
	}
}

func (s *Scene) Get(ctx context.Context, id string) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return scene, nil
}

func (s *Scene) List(ctx context.Context) ([]*db_model.Scene, error) {
	scenes, err := s.sceneRepo.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return scenes, nil
}

func (s *Scene) Create(ctx context.Context, input *model.CreateSceneInput) (*db_model.Scene, error) {
	scene := &db_model.Scene{
		ID:   ulid.Make(),
		Name: input.Name,
	}
	created, err := s.sceneRepo.Save(ctx, s.db, scene)
	if err != nil {
		return nil, errors.ErrSaveScene
	}
	return created, nil
}

func (s *Scene) Update(ctx context.Context, id string, input *model.UpdateSceneInput) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if input.Name != nil {
		scene.Name = *input.Name
	}

	updated, err := s.sceneRepo.Save(ctx, s.db, scene)
	if err != nil {
		return nil, errors.ErrSaveScene
	}
	return updated, nil
}

func (s *Scene) Delete(ctx context.Context, id string) (*db_model.Scene, error) {
	return s.sceneRepo.Delete(ctx, s.db, id)
}
