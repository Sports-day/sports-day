package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type User interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.User, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.User, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.User, error)
	FindByEmail(ctx context.Context, db *gorm.DB, email string) (*db_model.User, error)
	Save(ctx context.Context, db *gorm.DB, user *db_model.User) (*db_model.User, error)
	BatchCreate(ctx context.Context, db *gorm.DB, users []*db_model.User) ([]*db_model.User, error)
	Delete(ctx context.Context, db *gorm.DB, id string) error
	FindUserIdpBySub(ctx context.Context, db *gorm.DB, sub string) (*db_model.UsersIdp, error)
	FindUserIdpByMicrosoftUserID(ctx context.Context, db *gorm.DB, microsoftUserID string) (*db_model.UsersIdp, error)
	BatchFindUserIdpByMicrosoftUserIDs(ctx context.Context, db *gorm.DB, microsoftUserIDs []string) ([]*db_model.UsersIdp, error)
	BatchFindUserIdpByUserIDs(ctx context.Context, db *gorm.DB, userIDs []string) ([]*db_model.UsersIdp, error)
	SaveUserIdp(ctx context.Context, db *gorm.DB, userIdp *db_model.UsersIdp) (*db_model.UsersIdp, error)
	BatchCreateUserIdp(ctx context.Context, db *gorm.DB, userIdps []*db_model.UsersIdp) ([]*db_model.UsersIdp, error)
	GetRoleByUserID(ctx context.Context, db *gorm.DB, userID string) (*db_model.UserRole, error)
	BatchGetRolesByUserIDs(ctx context.Context, db *gorm.DB, userIDs []string) ([]*db_model.UserRole, error)
	SaveRole(ctx context.Context, db *gorm.DB, userRole *db_model.UserRole) (*db_model.UserRole, error)
}
