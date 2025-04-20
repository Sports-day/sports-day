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

type User struct {
	db             *gorm.DB
	userRepository repository.User
}

func NewUser(db *gorm.DB, userRepository repository.User) User {
	return User{db: db, userRepository: userRepository}
}

func (s *User) Get(ctx context.Context, id string) (*db_model.User, error) {
	user, err := s.userRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return user, nil
}

func (s *User) List(ctx context.Context) ([]*db_model.User, error) {
	users, err := s.userRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

func (s *User) Create(ctx context.Context, input *model.CreateUserInput) (*db_model.User, error) {
	user := &db_model.User{
		ID:    ulid.Make(),
		Name:  input.Name,
		Email: input.Email,
	}
	row, err := s.userRepository.Save(ctx, s.db, user)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return row, nil
}

func (s *User) GetUsersMapByIDs(ctx context.Context, userIDs []string) (map[string]*db_model.User, error) {
	users, err := s.userRepository.BatchGet(ctx, s.db, userIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	userMap := make(map[string]*db_model.User)
	for _, user := range users {
		userMap[user.ID] = user
	}
	return userMap, nil
}
