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

func (r image) BatchGet(ctx context.Context, db *gorm.DB, ids []string) (map[string]*db_model.Image, error) {
	var images []*db_model.Image
	if err := db.Where("id IN ?", ids).Find(&images).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	result := make(map[string]*db_model.Image, len(images))
	for _, img := range images {
		result[img.ID] = img
	}
	return result, nil
}

func (r image) Delete(ctx context.Context, db *gorm.DB, id string) error {
	return db.WithContext(ctx).Delete(&db_model.Image{}, "id = ?", id).Error
}

func (r image) MarkUploaded(ctx context.Context, db *gorm.DB, id string, url string) error {
	return db.WithContext(ctx).Model(&db_model.Image{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status": "uploaded",
			"url":    sql.NullString{String: url, Valid: true},
		}).Error
}
