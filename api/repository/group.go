package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Group interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Group, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Group, error)
	Save(ctx context.Context, db *gorm.DB, group *db_model.Group) (*db_model.Group, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Group, error)
	AddGroupUsers(ctx context.Context, db *gorm.DB, entries []*db_model.GroupUser) ([]*db_model.GroupUser, error)
	DeleteGroupUsers(ctx context.Context, db *gorm.DB, groupId string, userIds []string) ([]*db_model.GroupUser, error)
	BatchGetGroupUsersByUserIDs(ctx context.Context, db *gorm.DB, userIds []string) ([]*db_model.GroupUser, error)
	BatchGetGroupUsersByGroupIDs(ctx context.Context, db *gorm.DB, groupIds []string) ([]*db_model.GroupUser, error)
}
