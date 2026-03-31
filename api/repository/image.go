package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Image interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Image, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) (map[string]*db_model.Image, error)
	Create(ctx context.Context, db *gorm.DB, image *db_model.Image) (*db_model.Image, error)
	Update(ctx context.Context, db *gorm.DB, id string, status string, url string) error
	Delete(ctx context.Context, db *gorm.DB, id string) error
}
