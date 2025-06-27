package repository

import (
	"context"
	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Sports interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error)
	Create(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error)
	Update(ctx context.Context, db *gorm.DB, id string, input *UpdateSportsInput) (*db_model.Sport, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)
}

type UpdateSportsInput struct {
	Name *string
}