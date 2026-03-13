package repository

import (
	"context"
	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type image struct{}

func NewImage() Image {
	return image{}
}

func (r image) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Image, error) {
	var img db_model.Image

	if err := db.First(&img, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return &img, nil
}

func (r image) Create(ctx context.Context, db *gorm.DB, image *db_model.Image) (*db_model.Image, error) {
	if err := db.Create(image).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return image, nil
}

func (r image) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Image, error) {
	var img db_model.Image

	if err := db.First(&img, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	if err := db.Delete(&img).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return &img, nil
}

func (r image) ListByOwner(ctx context.Context, db *gorm.DB, ownerType string, ownerID string) ([]*db_model.Image, error) {

	var images []*db_model.Image

	if err := db.
		Where("owner_type = ? AND owner_id = ?", ownerType, ownerID).
		Find(&images).Error; err != nil {

		return nil, errors.Wrap(err)
	}

	return images, nil
}