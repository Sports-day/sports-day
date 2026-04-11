package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Information struct {
	db                    *gorm.DB
	informationRepository repository.Information
}

func NewInformation(db *gorm.DB, informationRepository repository.Information) Information {
	return Information{
		db:                    db,
		informationRepository: informationRepository,
	}
}

func (s *Information) Create(ctx context.Context, input *model.CreateInformationInput) (*db_model.Information, error) {
	status := "draft"
	if input.Status != nil && *input.Status != "" {
		status = *input.Status
	}

	maxOrder, err := s.informationRepository.MaxDisplayOrder(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	information := &db_model.Information{
		ID:           ulid.Make(),
		Title:        input.Title,
		Content:      input.Content,
		Status:       status,
		DisplayOrder: maxOrder + 1,
	}
	information, err = s.informationRepository.Save(ctx, s.db, information)
	if err != nil {
		return nil, errors.ErrSaveInformation
	}
	return information, nil
}

func (s *Information) Delete(ctx context.Context, id string) (*db_model.Information, error) {
	information, err := s.informationRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return information, nil
}

func (s *Information) Update(ctx context.Context, input model.UpdateInformationInput, id string) (*db_model.Information, error) {
	information, err := s.informationRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Title != nil {
		information.Title = *input.Title
	}

	if input.Content != nil {
		information.Content = *input.Content
	}

	if input.Status != nil && *input.Status != "" {
		information.Status = *input.Status
	}

	information, err = s.informationRepository.Save(ctx, s.db, information)
	if err != nil {
		return nil, errors.ErrSaveInformation
	}
	return information, nil
}

func (s *Information) GetByID(ctx context.Context, id string) (*db_model.Information, error) {
	information, err := s.informationRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return information, nil
}

func (s *Information) GetAll(ctx context.Context) ([]*db_model.Information, error) {
	informations, err := s.informationRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return informations, nil
}

func (s *Information) UpdateDisplayOrders(ctx context.Context, items []repository.DisplayOrderItem) error {
	return s.informationRepository.UpdateDisplayOrders(ctx, s.db, items)
}
