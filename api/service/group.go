package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/slices"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Group struct {
	db                  *gorm.DB
	groupRepository     repository.Group
	groupUserRepository repository.GroupUser
	userRepository      repository.User
}

func NewGroup(db *gorm.DB, groupRepository repository.Group, groupUserRepository repository.GroupUser, userRepository repository.User) *Group {
	return &Group{
		db:                  db,
		groupRepository:     groupRepository,
		groupUserRepository: groupUserRepository,
		userRepository:      userRepository,
	}
}

func (s *Group) Get(ctx context.Context, id string) (*db_model.Group, error) {
	group, err := s.groupRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) List(ctx context.Context) ([]*db_model.Group, error) {
	groups, err := s.groupRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return groups, nil
}

func (s *Group) Create(ctx context.Context, input *model.CreateGroupInput) (*db_model.Group, error) {
	group := &db_model.Group{
		ID:   ulid.Make(),
		Name: input.Name,
	}
	group, err := s.groupRepository.Save(ctx, s.db, group)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) Update(ctx context.Context, id string, input model.UpdateGroupInput) (*db_model.Group, error) {
	group, err := s.groupRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Name != nil {
		group.Name = *input.Name
	}

	group, err = s.groupRepository.Save(ctx, s.db, group)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) Delete(ctx context.Context, id string) (*db_model.Group, error) {
	group, err := s.groupRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) AddUsers(ctx context.Context, groupId string, userIds []string) (*db_model.Group, error) {
	entries := make([]*db_model.GroupUser, len(userIds))
	for i, userId := range userIds {
		entries[i] = &db_model.GroupUser{
			GroupID: groupId,
			UserID:  userId,
		}
	}

	_, err := s.groupUserRepository.AddUsers(ctx, s.db, entries)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	group, err := s.groupRepository.Get(ctx, s.db, groupId)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) DeleteUsers(ctx context.Context, groupId string, userIds []string) (*db_model.Group, error) {
	group, err := s.groupRepository.Get(ctx, s.db, groupId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.groupUserRepository.DeleteUsers(ctx, s.db, groupId, userIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) GetUsers(ctx context.Context, groupId string) ([]*db_model.User, error) {
	_, err := s.groupRepository.Get(ctx, s.db, groupId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupUsers, err := s.groupUserRepository.ListByGroupId(ctx, s.db, groupId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if len(groupUsers) == 0 {
		return []*db_model.User{}, nil
	}

	userIds := slices.Map(groupUsers, func(groupUser *db_model.GroupUser) string {
		return groupUser.UserID
	})

	users, err := s.userRepository.BulkGet(ctx, s.db, userIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

func (s *Group) GetUserGroups(ctx context.Context, userId string) ([]*db_model.Group, error) {
	groupUsers, err := s.groupUserRepository.ListByUserId(ctx, s.db, userId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if len(groupUsers) == 0 {
		return []*db_model.Group{}, nil
	}

	groupIds := slices.Map(groupUsers, func(groupUser *db_model.GroupUser) string {
		return groupUser.GroupID
	})

	groups, err := s.groupRepository.BulkGet(ctx, s.db, groupIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return groups, nil
}
