package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type User interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.User, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.User, error)
	Create(ctx context.Context, db *gorm.DB, user *db_model.User) (*db_model.User, error)
	FindByEmail(ctx context.Context, db *gorm.DB, email string) (*db_model.User, error)
	Update(ctx context.Context, db *gorm.DB, user *db_model.User) (*db_model.User, error)
}
