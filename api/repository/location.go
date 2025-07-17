package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Location interface {
	Save(ctx context.Context, db *gorm.DB, location *db_model.Location) (*db_model.Location, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Location, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Location, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Location, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Location, error)
}
