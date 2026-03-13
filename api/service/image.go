package service

import (
	"context"
	"fmt"
	"path/filepath"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/storage"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Image struct {
	db *gorm.DB

	imageRepository repository.Image
	storage         *storage.Client
}

func NewImage(
	db *gorm.DB,
	imageRepository repository.Image,
	storage *storage.Client,
) *Image {

	return &Image{
		db:              db,
		imageRepository: imageRepository,
		storage:         storage,
	}
}

type UploadURLResult struct {
	URL       string
	ObjectKey string
}

func (s *Image) CreateUploadURL(
	ctx context.Context,
	ownerType string,
	ownerID string,
	filename string,
) (*UploadURLResult, error) {

	id := ulid.Make()

	ext := filepath.Ext(filename)

	objectKey := fmt.Sprintf(
		"images/%s/%s%s",
		ownerType,
		id,
		ext,
	)

	url, err := s.storage.PresignPutObject(objectKey)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return &UploadURLResult{
		URL:       url,
		ObjectKey: objectKey,
	}, nil
}

func (s *Image) CreateImage(
	ctx context.Context,
	ownerType string,
	ownerID string,
	objectKey string,
	contentType string,
) (*db_model.Image, error) {

	image := &db_model.Image{
		ID:          ulid.Make(),
		ObjectKey:   objectKey,
		OwnerType:   ownerType,
		OwnerID:     ownerID,
		ContentType: contentType,
	}

	image, err := s.imageRepository.Create(ctx, s.db, image)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return image, nil
}

func (s *Image) DeleteImage(
	ctx context.Context,
	id string,
) (*db_model.Image, error) {

	img, err := s.imageRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	err = s.storage.DeleteObject(img.ObjectKey)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	img, err = s.imageRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return img, nil
}

func (s *Image) ListByOwner(
	ctx context.Context,
	ownerType string,
	ownerID string,
) ([]*db_model.Image, error) {

	images, err := s.imageRepository.ListByOwner(ctx, s.db, ownerType, ownerID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return images, nil
}
