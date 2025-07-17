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

type Location struct {
	db                 *gorm.DB
	locationRepository repository.Location
}

func NewLocation(db *gorm.DB, locationRepository repository.Location) Location {
	return Location{
		db:                 db,
		locationRepository: locationRepository,
	}
}

func (s *Location) Create(ctx context.Context, input *model.CreateLocationInput) (*db_model.Location, error) {
	location := &db_model.Location{
		ID:   ulid.Make(),
		Name: input.Name,
	}

	location, err := s.locationRepository.Save(ctx, s.db, location)
	if err != nil {
		return nil, errors.ErrSaveLocation
	}
	return location, nil
}

func (s *Location) Get(ctx context.Context, id string) (*db_model.Location, error) {
	location, err := s.locationRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return location, nil
}

func (s *Location) Update(ctx context.Context, id string, input model.UpdateLocationInput) (*db_model.Location, error) {
	location, err := s.locationRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Name != nil {
		location.Name = *input.Name
	}

	location, err = s.locationRepository.Save(ctx, s.db, location)
	if err != nil {
		return nil, errors.ErrSaveLocation
	}
	return location, nil
}

func (s *Location) Delete(ctx context.Context, id string) (*db_model.Location, error) {
	location, err := s.locationRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return location, nil
}

func (s *Location) List(ctx context.Context) ([]*db_model.Location, error) {
	locations, err := s.locationRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return locations, nil
}

func (s *Location) GetLocationMapByIDs(ctx context.Context, locationIDs []string) (map[string]*db_model.Location, error) {
	locations, err := s.locationRepository.BatchGet(ctx, s.db, locationIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	locationMap := make(map[string]*db_model.Location)
	for _, location := range locations {
		locationMap[location.ID] = location
	}
	return locationMap, nil
}
