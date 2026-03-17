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
) (*db_model.Image, error) {

	db := r.db
	if tx != nil {
		db = tx
	}

	var img db_model.Image

	err := db.WithContext(ctx).
		Model(&img).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":      "uploaded",
			"url":         url,
			"uploaded_at": time.Now(),
		}).Error

	if err != nil {
		return nil, err
	}

	return &img, nil
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
		id.String(),
	).Error

	return err
}

func (r *imageRepository) CreateImage(
	ctx context.Context,
	id ulid.ULID,
) error {

	image := &db_model.Image{
		ID:     id.String(),
		Status: "pending",
	}

	return r.db.WithContext(ctx).Create(image).Error
}

func (r *imageRepository) Get(
	ctx context.Context,
	tx *gorm.DB,
	id string,
) (*db_model.Image, error) {

	db := r.db
	if tx != nil {
		db = tx
	}

	var img db_model.Image

	if err := db.WithContext(ctx).
		Where("id = ?", id).
		First(&img).Error; err != nil {
		return nil, err
	}

	return &img, nil
}

func (r *imageRepository) Create(
	ctx context.Context,
	tx *gorm.DB,
	image *db_model.Image,
) (*db_model.Image, error) {

	db := r.db
	if tx != nil {
		db = tx
	}

	if err := db.WithContext(ctx).
		Create(image).Error; err != nil {
		return nil, err
	}

	return image, nil
}

