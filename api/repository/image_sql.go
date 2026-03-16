package repository

import (
	"context"
	"database/sql"

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

func (r image) MarkUploaded(ctx context.Context, db *gorm.DB, id string, url string) (*db_model.Image, error) {
	var img db_model.Image
	if err := db.First(&img, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	img.Status = "uploaded"
	img.URL = sql.NullString{
		String: url,
		Valid:  true,
	}

	if err := db.Save(&img).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return &img, nil
}
