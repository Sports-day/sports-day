package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
)

type location struct{}

func NewLocation() Location {
	return location{}
}

func (r location) Save(ctx context.Context, db *gorm.DB, location *db_model.Location) (*db_model.Location, error) {
	if err := db.Save(location).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return location, nil
}

func (r location) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Location, error) {
	var location db_model.Location
	if err := db.First(&location, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLocationNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.Delete(&location).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &location, nil
}

func (r location) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Location, error) {
	var location db_model.Location
	if err := db.First(&location, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrLocationNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &location, nil
}

func (r location) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Location, error) {
	var locations []*db_model.Location
	if err := db.Where("id IN ?", ids).Find(&locations).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return locations, nil
}

func (r location) List(ctx context.Context, db *gorm.DB) ([]*db_model.Location, error) {
	var locations []*db_model.Location
	if err := db.Find(&locations).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return locations, nil
}
