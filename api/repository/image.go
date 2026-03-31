package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Image interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Image, error)
	Create(ctx context.Context, db *gorm.DB, image *db_model.Image) (*db_model.Image, error)
	MarkUploaded(ctx context.Context, db *gorm.DB, id string, url string) (*db_model.Image, error)
}
