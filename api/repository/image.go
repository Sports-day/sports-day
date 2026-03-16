package repository

import (
	"context"

	"time"

	"sports-day/api/db_model"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

type Image interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Image, error)
	Create(ctx context.Context, db *gorm.DB, image *db_model.Image) (*db_model.Image, error)
	MarkUploaded(ctx context.Context, db *gorm.DB, id string, url string) (*db_model.Image, error)

}

type imageRepository struct {
	db *gorm.DB
}

func (r *imageRepository) MarkUploaded(
	ctx context.Context,
	tx *gorm.DB,
	id string,
	url string,
) (bool, error) {

	db := r.db
	if tx != nil {
		db = tx
	}

	result := db.WithContext(ctx).
		Model(&db_model.Image{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":      "uploaded",
			"url":         url,
			"uploaded_at": time.Now(),
		})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *imageRepository) UpdateImageStatus(
	ctx context.Context,
	id ulid.ULID,
	status string,
	url string,
) error {

	query := `
	UPDATE images
	SET
	    status = $1,
	    url = $2,
	    uploaded_at = now()
	WHERE id = $3
	`

	err := r.db.WithContext(ctx).Exec(
		query,
		status,
		url,
		id,
	).Error

	return err
}
