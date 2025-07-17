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

type Team struct {
	db             *gorm.DB
	teamRepository repository.Team
	userRepository repository.User
}

func NewTeam(db *gorm.DB, teamRepository repository.Team, userRepository repository.User) Team {
	return Team{
		db:             db,
		teamRepository: teamRepository,
		userRepository: userRepository,
	}
}

func (s *Team) Create(ctx context.Context, input *model.CreateTeamInput) (*db_model.Team, error) {
	var team *db_model.Team

	err := s.db.Transaction(func(tx *gorm.DB) error {
		t := &db_model.Team{
			ID:      ulid.Make(),
			Name:    input.Name,
			GroupID: input.GroupID,
		}
		created, err := s.teamRepository.Save(ctx, tx, t)
		if err != nil {
			return errors.ErrSaveTeam
		}

		if len(input.UserIds) > 0 {
			if _, err := s.teamRepository.AddTeamUsers(ctx, tx, created.ID, input.UserIds); err != nil {
				return errors.ErrAddTeamUser
			}
		}

		team = created
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return team, nil
}

func (s *Team) Get(ctx context.Context, id string) (*db_model.Team, error) {
	team, err := s.teamRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return team, nil
}

func (s *Team) Update(ctx context.Context, id string, input model.UpdateTeamInput) (*db_model.Team, error) {
	team, err := s.teamRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Name != nil {
		team.Name = *input.Name
	}
	if input.GroupID != nil {
		team.GroupID = *input.GroupID
	}

	team, err = s.teamRepository.Save(ctx, s.db, team)
	if err != nil {
		return nil, errors.ErrSaveTeam
	}
	return team, nil
}

func (s *Team) Delete(ctx context.Context, id string) (*db_model.Team, error) {
	team, err := s.teamRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return team, nil
}

func (s *Team) List(ctx context.Context) ([]*db_model.Team, error) {
	teams, err := s.teamRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return teams, nil
}

func (s *Team) AddUsers(ctx context.Context, teamId string, userIds []string) (*db_model.Team, error) {
	_, err := s.teamRepository.Get(ctx, s.db, teamId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTeamNotFound
		}
	}

	if _, err := s.teamRepository.AddTeamUsers(ctx, s.db, teamId, userIds); err != nil {
		return nil, errors.ErrAddTeamUser
	}

	team, err := s.teamRepository.Get(ctx, s.db, teamId)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return team, nil
}

func (s *Team) DeleteUsers(ctx context.Context, teamId string, userIds []string) (*db_model.Team, error) {
	team, err := s.teamRepository.Get(ctx, s.db, teamId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.teamRepository.DeleteTeamUsers(ctx, s.db, teamId, userIds)
	if err != nil {
		return nil, errors.ErrDeleteTeamUser
	}
	return team, nil
}

func (s *Team) GetTeamsMapByIDs(ctx context.Context, teamIDs []string) (map[string]*db_model.Team, error) {
	teams, err := s.teamRepository.BatchGet(ctx, s.db, teamIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	teamMap := make(map[string]*db_model.Team)
	for _, team := range teams {
		teamMap[team.ID] = team
	}
	return teamMap, nil
}

func (s *Team) GetTeamUsersMapByTeamIDs(ctx context.Context, teamIds []string) (map[string][]*db_model.TeamUser, error) {
	teamUsers, err := s.teamRepository.BatchGetTeamUsersByTeamIDs(ctx, s.db, teamIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	teamUsersMap := make(map[string][]*db_model.TeamUser)
	for _, teamUser := range teamUsers {
		teamUsersMap[teamUser.TeamID] = append(teamUsersMap[teamUser.TeamID], teamUser)
	}
	return teamUsersMap, nil
}

func (s *Team) GetTeamUsersMapByUserIDs(ctx context.Context, userIds []string) (map[string][]*db_model.TeamUser, error) {
	teamUsers, err := s.teamRepository.BatchGetTeamUsersByUserIDs(ctx, s.db, userIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	teamUsersMap := make(map[string][]*db_model.TeamUser)
	for _, teamUser := range teamUsers {
		teamUsersMap[teamUser.UserID] = append(teamUsersMap[teamUser.UserID], teamUser)
	}
	return teamUsersMap, nil
}

func (s *Team) GetTeamsMapByGroupIDs(ctx context.Context, groupIds []string) (map[string][]*db_model.Team, error) {
	teams, err := s.teamRepository.BatchGetTeamsByGroupIDs(ctx, s.db, groupIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupTeamsMap := make(map[string][]*db_model.Team)
	for _, team := range teams {
		groupTeamsMap[team.GroupID] = append(groupTeamsMap[team.GroupID], team)
	}
	return groupTeamsMap, nil
}
