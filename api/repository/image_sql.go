package repository

import (
	"context"
	"database/sql"
	"time"

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

func (r image) List(ctx context.Context, db *gorm.DB) ([]*db_model.Image, error) {
	var images []*db_model.Image
	if err := db.WithContext(ctx).Order("display_order ASC, created_at ASC").Find(&images).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return images, nil
}

func (r image) UpdateDisplayOrders(ctx context.Context, db *gorm.DB, items []DisplayOrderItem) error {
	return db.Transaction(func(tx *gorm.DB) error {
		for _, item := range items {
			if err := tx.Model(&db_model.Image{}).Where("id = ?", item.ID).
				Update("display_order", item.DisplayOrder).Error; err != nil {
				return errors.Wrap(err)
			}
		}
		return nil
	})
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
	result := db.WithContext(ctx).Model(&db_model.Image{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":      "uploaded",
			"url":         sql.NullString{String: url, Valid: true},
			"uploaded_at": sql.NullTime{Time: time.Now(), Valid: true},
		})
	if result.Error != nil {
		return errors.Wrap(result.Error)
	}
	if result.RowsAffected == 0 {
		return errors.Wrap(gorm.ErrRecordNotFound)
	}
	return nil
}
