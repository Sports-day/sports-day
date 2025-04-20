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

type Group struct {
	db              *gorm.DB
	groupRepository repository.Group
	userRepository  repository.User
}

func NewGroup(db *gorm.DB, groupRepository repository.Group, userRepository repository.User) Group {
	return Group{
		db:              db,
		groupRepository: groupRepository,
		userRepository:  userRepository,
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

	_, err := s.groupRepository.AddGroupUsers(ctx, s.db, entries)
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

	_, err = s.groupRepository.DeleteGroupUsers(ctx, s.db, groupId, userIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return group, nil
}

func (s *Group) GetGroupUsersMapByGroupIDs(ctx context.Context, groupIds []string) (map[string][]*db_model.GroupUser, error) {
	groupUsers, err := s.groupRepository.BatchGetGroupUsersByGroupIDs(ctx, s.db, groupIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupUserMap := make(map[string][]*db_model.GroupUser)
	for _, groupUser := range groupUsers {
		groupUserMap[groupUser.GroupID] = append(groupUserMap[groupUser.GroupID], groupUser)
	}
	return groupUserMap, nil
}

func (s *Group) GetGroupUsersMapByUserIDs(ctx context.Context, userIDs []string) (map[string][]*db_model.GroupUser, error) {
	groupUsers, err := s.groupRepository.BatchGetGroupUsersByUserIDs(ctx, s.db, userIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupUserMap := make(map[string][]*db_model.GroupUser)
	for _, groupUser := range groupUsers {
		groupUserMap[groupUser.UserID] = append(groupUserMap[groupUser.UserID], groupUser)
	}
	return groupUserMap, nil
}

func (s *Group) GetGroupsMapByIDs(ctx context.Context, groupIDs []string) (map[string]*db_model.Group, error) {
	groups, err := s.groupRepository.BatchGet(ctx, s.db, groupIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupMap := make(map[string]*db_model.Group)
	for _, group := range groups {
		groupMap[group.ID] = group
	}
	return groupMap, nil
}
