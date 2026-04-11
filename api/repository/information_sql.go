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
	if err := db.Order("display_order ASC, created_at ASC").Find(&informations).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return informations, nil
}

func (r information) MaxDisplayOrder(ctx context.Context, db *gorm.DB) (int, error) {
	var max int
	err := db.Model(&db_model.Information{}).Select("COALESCE(MAX(display_order), 0)").Scan(&max).Error
	if err != nil {
		return 0, errors.Wrap(err)
	}
	return max, nil
}

func (r information) UpdateDisplayOrders(ctx context.Context, db *gorm.DB, items []DisplayOrderItem) error {
	return db.Transaction(func(tx *gorm.DB) error {
		for _, item := range items {
			if err := tx.Model(&db_model.Information{}).Where("id = ?", item.ID).
				Update("display_order", item.DisplayOrder).Error; err != nil {
				return errors.Wrap(err)
			}
		}
		return nil
	})
}
