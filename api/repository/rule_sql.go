package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type rule struct{}

func NewRule() Rule {
	return rule{}
}

func (r rule) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Rule, error) {
	var rule db_model.Rule
	if err := db.First(&rule, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r rule) List(ctx context.Context, db *gorm.DB) ([]*db_model.Rule, error) {
	var rules []*db_model.Rule
	if err := db.Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r rule) Save(ctx context.Context, db *gorm.DB, rule *db_model.Rule) (*db_model.Rule, error) {
	if err := db.Save(rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (r rule) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Rule, error) {
	var rule db_model.Rule
	if err := db.First(&rule, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}
