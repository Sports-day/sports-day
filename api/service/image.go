package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Image struct {
	db              *gorm.DB
	imageRepository repository.Image
}

func NewImage(db *gorm.DB, imageRepository repository.Image) Image {
	return Image{
		db:              db,
		imageRepository: imageRepository,
	}
}

func (s *Image) CreateUploadURL(
	ctx context.Context,
	ownerType string,
	ownerID *string,
	filename string,
) (*db_model.Image, error) {

	img := &db_model.Image{
		ID:     ulid.Make(),
		Status: "pending",
	}

	img, err := s.imageRepository.Create(ctx, s.db, img)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return img, nil
}

func (s *Image) MarkUploaded(
	ctx context.Context,
	id string,
	url string,
) (*db_model.Image, error) {

	return s.imageRepository.MarkUploaded(ctx, s.db, id, url)
}
