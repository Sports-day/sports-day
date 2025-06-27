package repository

import (
	"context"
	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type sports struct {
	
}

func NewSports() Sports {
	return sports{}
}

func (r sports) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.First(&sport, "id = ?", id).Error; err != nil {
		return nil,errors.Wrap(err)
	}
	return &sport, nil
}

func (r sports) List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error) {
	var sports []*db_model.Sport
	if err := db.First(&sports).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (r sports) Create(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error) {
	if err := db.Create(sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (r sports) Update(ctx context.Context, db *gorm.DB, id string, input UpdateSportsInput) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.First(&sport, "id = ?", id).Error; err != nil{
		return nil, errors.Wrap(err)
	}
	if input.Name != nil {
		sport.Name = *input.Name
	}
	if err := db.Save(&sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sport,nil
}

func (r sports) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.First(&sport, "id = ?", id).Error; err != nil {
		return nil,errors.Wrap(err)
	}
	if err := db.Delete(&sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sport, nil
}