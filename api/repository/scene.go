package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Scene interface {
	Save(ctx context.Context, db *gorm.DB, scene *db_model.Scene) (*db_model.Scene, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Scene, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Scene, error)
}
