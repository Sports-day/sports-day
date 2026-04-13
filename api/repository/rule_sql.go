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
	if err := db.WithContext(ctx).First(&rule, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrRuleNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r rule) List(ctx context.Context, db *gorm.DB) ([]*db_model.Rule, error) {
	var rules []*db_model.Rule
	if err := db.WithContext(ctx).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r rule) Save(ctx context.Context, db *gorm.DB, rule *db_model.Rule) (*db_model.Rule, error) {
	if err := db.WithContext(ctx).Save(rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (r rule) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Rule, error) {
	var rule db_model.Rule
	if err := db.WithContext(ctx).First(&rule, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrRuleNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.WithContext(ctx).Delete(&rule).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &rule, nil
}

func (r rule) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Rule, error) {
	var rules []*db_model.Rule
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r rule) ListBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.Rule, error) {
	var rules []*db_model.Rule
	if err := db.WithContext(ctx).Where("sport_id = ?", sportID).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r rule) ListBySportIDs(ctx context.Context, db *gorm.DB, sportIDs []string) ([]*db_model.Rule, error) {
	var rules []*db_model.Rule
	if err := db.WithContext(ctx).Where("sport_id IN ?", sportIDs).Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}
