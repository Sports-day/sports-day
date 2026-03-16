package service

import (
	"context"
	goerrors "errors"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Sport struct {
	db               *gorm.DB
	sportsRepository repository.Sports
	imageRepository  repository.Image
}

func NewSports(
	db *gorm.DB,
	sportsRepository repository.Sports,
	imageRepository repository.Image,
) Sport {
	return Sport{
		db:               db,
		sportsRepository: sportsRepository,
		imageRepository:  imageRepository,
	}
}

func (s *Sport) Get(ctx context.Context, id string) (*db_model.Sport, error) {
	sport, err := s.sportsRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (s *Sport) List(ctx context.Context) ([]*db_model.Sport, error) {
	sports, err := s.sportsRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (s *Sport) Create(ctx context.Context, input *model.CreateSportsInput) (*db_model.Sport, error) {
	sport := &db_model.Sport{
		ID:   ulid.Make(),
		Name: input.Name,
	}

	sport, err := s.sportsRepository.Save(ctx, s.db, sport)
	if err != nil {
		return nil, errors.ErrSaveSport
	}

	return sport, nil
}

func (s *Sport) Update(ctx context.Context, id string, input model.UpdateSportsInput) (*db_model.Sport, error) {
	sport, err := s.sportsRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Name != nil {
		sport.Name = *input.Name
	}

	if input.Weight != nil {
		sport.Weight = int(*input.Weight)
	}

	sport, err = s.sportsRepository.Save(ctx, s.db, sport)
	if err != nil {
		return nil, errors.ErrSaveSport
	}

	return sport, nil
}

func (s *Sport) Delete(ctx context.Context, id string) (*db_model.Sport, error) {
	sport, err := s.sportsRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (s *Sport) SetImage(
	ctx context.Context,
	sportID string,
	imageID string,
) error {

	img, err := s.imageRepository.Get(ctx, s.db, imageID)
	if err != nil {
		return err
	}

	if img.Status != "uploaded" {
		return goerrors.New("image not uploaded yet")
	}

	return s.sportsRepository.UpdateImageID(
		ctx,
		s.db,
		sportID,
		imageID,
	)
}