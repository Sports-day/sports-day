package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
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

func (r user) FindByEmail(ctx context.Context, db *gorm.DB, email string) (*db_model.User, error) {
	var user db_model.User
	if err := db.First(&user, "email = ?", email).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &user, nil
}
