package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Information interface {
	Save(ctx context.Context, db *gorm.DB, information *db_model.Information) (*db_model.Information, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Information, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Information, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Information, error)
}
