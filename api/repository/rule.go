package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type UpdateRuleInput struct {
	Rule *string
}

type Rule interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Rule, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Rule, error)
	Save(ctx context.Context, db *gorm.DB, rule *db_model.Rule) (*db_model.Rule, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Rule, error)
}
