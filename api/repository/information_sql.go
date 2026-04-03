package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type information struct{}

func NewInformation() Information {
	return information{}
}

func (r information) Save(ctx context.Context, db *gorm.DB, information *db_model.Information) (*db_model.Information, error) {
	if err := db.Save(information).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return information, nil
}

func (r information) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Information, error) {
	var information db_model.Information
	if err := db.First(&information, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrInformationNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&information).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &information, nil
}

func (r information) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Information, error) {
	var information db_model.Information
	if err := db.First(&information, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrInformationNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &information, nil
}

func (r information) List(ctx context.Context, db *gorm.DB) ([]*db_model.Information, error) {
	var informations []*db_model.Information
	if err := db.Find(&informations).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return informations, nil
}

func (r information) PublishScheduled(ctx context.Context, db *gorm.DB) (int64, error) {
	result := db.Model(&db_model.Information{}).
		Where("status = ? AND scheduled_at <= NOW()", "scheduled").
		Update("status", "published")
	if result.Error != nil {
		return 0, errors.Wrap(result.Error)
	}
	return result.RowsAffected, nil
}
