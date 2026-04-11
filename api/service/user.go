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
	db              *gorm.DB
	userRepository  repository.User
	groupRepository repository.Group
}

func NewUser(db *gorm.DB, userRepository repository.User, groupRepository repository.Group) User {
	return User{db: db, userRepository: userRepository, groupRepository: groupRepository}
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
	var result *db_model.User
	err := s.db.Transaction(func(tx *gorm.DB) error {
		user, err := s.createUserWithIdp(ctx, tx, input)
		if err != nil {
			return err
		}
		result = user
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return result, nil
}

// BatchCreate はユーザーを一括作成する（1トランザクション）
func (s *User) BatchCreate(ctx context.Context, inputs []*model.CreateUserInput) ([]*db_model.User, error) {
	// バッチ内の重複チェック
	seenMsIds := make(map[string]struct{})
	for _, input := range inputs {
		if _, exists := seenMsIds[input.MicrosoftUserID]; exists {
			return nil, errors.ErrDuplicateMicrosoftUserIDInBatch
		}
		seenMsIds[input.MicrosoftUserID] = struct{}{}
	}

	// DB上の既存ユーザーとの重複チェック
	for _, input := range inputs {
		_, err := s.userRepository.FindUserIdpByMicrosoftUserID(ctx, s.db, input.MicrosoftUserID)
		if err == nil {
			return nil, errors.ErrDuplicateMicrosoftUserID
		}
		if !errors.Is(err, errors.ErrUserNotFound) {
			return nil, errors.Wrap(err)
		}
	}

	// groupId の存在チェック
	groupIdSet := make(map[string]struct{})
	for _, input := range inputs {
		if input.GroupID != nil {
			groupIdSet[*input.GroupID] = struct{}{}
		}
	}
	for gid := range groupIdSet {
		if _, err := s.groupRepository.Get(ctx, s.db, gid); err != nil {
			return nil, errors.ErrGroupNotFound
		}
	}

	users := make([]*db_model.User, len(inputs))
	idps := make([]*db_model.UsersIdp, len(inputs))
	var groupUsers []*db_model.GroupUser

	for i, input := range inputs {
		id := ulid.Make()
		users[i] = &db_model.User{ID: id}

		idp := &db_model.UsersIdp{
			UserID:   id,
			Provider: "microsoft",
		}
		idp.MicrosoftUserID.String = input.MicrosoftUserID
		idp.MicrosoftUserID.Valid = true
		idps[i] = idp

		if input.GroupID != nil {
			groupUsers = append(groupUsers, &db_model.GroupUser{
				GroupID: *input.GroupID,
				UserID:  id,
			})
		}
	}

	err := s.db.Transaction(func(tx *gorm.DB) error {
		if _, err := s.userRepository.BatchSave(ctx, tx, users); err != nil {
			return errors.Wrap(err)
		}
		if _, err := s.userRepository.BatchSaveUserIdp(ctx, tx, idps); err != nil {
			return errors.Wrap(err)
		}
		if len(groupUsers) > 0 {
			if _, err := s.groupRepository.AddGroupUsers(ctx, tx, groupUsers); err != nil {
				return errors.Wrap(err)
			}
		}
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return users, nil
}

// createUserWithIdp は1人分のユーザー + users_idp + group_users を作成する（トランザクション内で使用）
func (s *User) createUserWithIdp(ctx context.Context, tx *gorm.DB, input *model.CreateUserInput) (*db_model.User, error) {
	user := &db_model.User{ID: ulid.Make()}
	row, err := s.userRepository.Save(ctx, tx, user)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	idp := &db_model.UsersIdp{
		UserID:   row.ID,
		Provider: "microsoft",
	}
	idp.MicrosoftUserID.String = input.MicrosoftUserID
	idp.MicrosoftUserID.Valid = true
	if _, err := s.userRepository.SaveUserIdp(ctx, tx, idp); err != nil {
		return nil, errors.Wrap(err)
	}

	if input.GroupID != nil {
		entry := &db_model.GroupUser{
			GroupID: *input.GroupID,
			UserID:  row.ID,
		}
		if _, err := s.groupRepository.AddGroupUsers(ctx, tx, []*db_model.GroupUser{entry}); err != nil {
			return nil, errors.Wrap(err)
		}
	}

	return row, nil
}

func (s *User) GetUserIdpMapByUserIDs(ctx context.Context, userIDs []string) (map[string]*db_model.UsersIdp, error) {
	records, err := s.userRepository.BatchFindUserIdpByUserIDs(ctx, s.db, userIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	idpMap := make(map[string]*db_model.UsersIdp)
	for _, rec := range records {
		idpMap[rec.UserID] = rec
	}
	return idpMap, nil
}

func (s *User) GetRoleMapByUserIDs(ctx context.Context, userIDs []string) (map[string]string, error) {
	records, err := s.userRepository.BatchGetRolesByUserIDs(ctx, s.db, userIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	roleMap := make(map[string]string)
	for _, rec := range records {
		roleMap[rec.UserID] = rec.Role
	}
	return roleMap, nil
}

func (s *User) Delete(ctx context.Context, id string) (*db_model.User, error) {
	user, err := s.userRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if err := s.userRepository.Delete(ctx, s.db, id); err != nil {
		return nil, errors.Wrap(err)
	}
	return user, nil
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
