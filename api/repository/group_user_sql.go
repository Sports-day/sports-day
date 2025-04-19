package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type groupUser struct{}

func NewGroupUser() GroupUser {
	return groupUser{}
}

func (r groupUser) AddUsers(ctx context.Context, db *gorm.DB, entries []*db_model.GroupUser) ([]*db_model.GroupUser, error) {
	if err := db.Create(entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r groupUser) DeleteUsers(ctx context.Context, db *gorm.DB, groupId string, userIds []string) ([]*db_model.GroupUser, error) {
	if err := db.Where("group_id = ? AND user_id IN (?)", groupId, userIds).Delete(&db_model.GroupUser{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return nil, nil
}

func (r groupUser) ListByGroupId(ctx context.Context, db *gorm.DB, groupId string) ([]*db_model.GroupUser, error) {
	var groupUsers []*db_model.GroupUser
	if err := db.Where("group_id = ?", groupId).Find(&groupUsers).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return groupUsers, nil
}

func (r groupUser) ListByUserId(ctx context.Context, db *gorm.DB, userId string) ([]*db_model.GroupUser, error) {
	var groupUsers []*db_model.GroupUser
	if err := db.Where("user_id = ?", userId).Find(&groupUsers).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return groupUsers, nil
}
