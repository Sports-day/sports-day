package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type group struct{}

func NewGroup() Group {
	return group{}
}

func (r group) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error) {
	var group db_model.Group
	if err := db.First(&group, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrGroupNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &group, nil
}

func (r group) BulkGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Group, error) {
	var groups []*db_model.Group
	if err := db.Where("id IN (?)", ids).Find(&groups).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return groups, nil
}

func (r group) List(ctx context.Context, db *gorm.DB) ([]*db_model.Group, error) {
	var groups []*db_model.Group
	if err := db.Find(&groups).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return groups, nil
}

func (r group) Save(ctx context.Context, db *gorm.DB, group *db_model.Group) (*db_model.Group, error) {
	if err := db.Save(group).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (r group) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error) {
	var group db_model.Group
	if err := db.First(&group, "id = ?", id).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&group).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &group, nil
}
