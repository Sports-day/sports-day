package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type user struct{}

func NewUser() User { return user{} }

func (r user) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.User, error) {
	var user db_model.User
	if err := db.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &user, nil
}

func (r user) List(ctx context.Context, db *gorm.DB) ([]*db_model.User, error) {
	var users []*db_model.User
	if err := db.Find(&users).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

func (r user) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.User, error) {
	var users []*db_model.User
	if err := db.Where("id IN (?)", ids).Find(&users).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

func (r user) Save(ctx context.Context, db *gorm.DB, user *db_model.User) (*db_model.User, error) {
	if err := db.Save(user).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return user, nil
}

func (r user) BatchSave(ctx context.Context, db *gorm.DB, users []*db_model.User) ([]*db_model.User, error) {
	if len(users) == 0 {
		return users, nil
	}
	if err := db.Create(&users).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

func (r user) Delete(ctx context.Context, db *gorm.DB, id string) error {
	if err := db.Delete(&db_model.User{}, "id = ?", id).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r user) FindByEmail(ctx context.Context, db *gorm.DB, email string) (*db_model.User, error) {
	var user db_model.User
	if err := db.First(&user, "email = ?", email).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &user, nil
}

func (r user) FindUserIdpBySub(ctx context.Context, db *gorm.DB, sub string) (*db_model.UsersIdp, error) {
	var record db_model.UsersIdp
	if err := db.First(&record, "sub = ?", sub).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &record, nil
}

func (r user) FindUserIdpByMicrosoftUserID(ctx context.Context, db *gorm.DB, microsoftUserID string) (*db_model.UsersIdp, error) {
	var record db_model.UsersIdp
	if err := db.First(&record, "microsoft_user_id = ?", microsoftUserID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &record, nil
}

func (r user) BatchFindUserIdpByUserIDs(ctx context.Context, db *gorm.DB, userIDs []string) ([]*db_model.UsersIdp, error) {
	var records []*db_model.UsersIdp
	if err := db.Where("user_id IN (?)", userIDs).Find(&records).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return records, nil
}

func (r user) SaveUserIdp(ctx context.Context, db *gorm.DB, userIdp *db_model.UsersIdp) (*db_model.UsersIdp, error) {
	if err := db.Where("user_id = ?", userIdp.UserID).Save(userIdp).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return userIdp, nil
}

func (r user) BatchSaveUserIdp(ctx context.Context, db *gorm.DB, userIdps []*db_model.UsersIdp) ([]*db_model.UsersIdp, error) {
	if len(userIdps) == 0 {
		return userIdps, nil
	}
	if err := db.Create(&userIdps).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return userIdps, nil
}

func (r user) GetRoleByUserID(ctx context.Context, db *gorm.DB, userID string) (*db_model.UserRole, error) {
	var record db_model.UserRole
	if err := db.First(&record, "user_id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrRoleNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &record, nil
}

func (r user) BatchGetRolesByUserIDs(ctx context.Context, db *gorm.DB, userIDs []string) ([]*db_model.UserRole, error) {
	var records []*db_model.UserRole
	if err := db.Where("user_id IN (?)", userIDs).Find(&records).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return records, nil
}

func (r user) SaveRole(ctx context.Context, db *gorm.DB, userRole *db_model.UserRole) (*db_model.UserRole, error) {
	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"role"}),
	}).Create(userRole).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return userRole, nil
}
