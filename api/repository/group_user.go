package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type GroupUser interface {
	AddUsers(ctx context.Context, db *gorm.DB, entries []*db_model.GroupUser) ([]*db_model.GroupUser, error)
	DeleteUsers(ctx context.Context, db *gorm.DB, groupId string, userIds []string) ([]*db_model.GroupUser, error)
	ListByGroupId(ctx context.Context, db *gorm.DB, groupId string) ([]*db_model.GroupUser, error)
	ListByUserId(ctx context.Context, db *gorm.DB, userId string) ([]*db_model.GroupUser, error)
}
