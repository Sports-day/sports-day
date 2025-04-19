package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Group interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error)
	BulkGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Group, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Group, error)
	Save(ctx context.Context, db *gorm.DB, group *db_model.Group) (*db_model.Group, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error)
}
