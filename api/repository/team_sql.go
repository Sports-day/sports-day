package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type team struct{}

func NewTeam() Team {
	return team{}
}

func (r team) Save(ctx context.Context, db *gorm.DB, team *db_model.Team) (*db_model.Team, error) {
	if err := db.Save(team).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return team, nil
}

func (r team) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Team, error) {
	var team db_model.Team
	if err := db.First(&team, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTeamNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&team).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &team, nil
}

func (r team) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Team, error) {
	var team db_model.Team
	if err := db.First(&team, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTeamNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &team, nil
}

func (r team) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Team, error) {
	var teams []*db_model.Team
	if err := db.Where("id IN (?)", ids).Find(&teams).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teams, nil
}

func (r team) List(ctx context.Context, db *gorm.DB) ([]*db_model.Team, error) {
	var teams []*db_model.Team
	if err := db.Find(&teams).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teams, nil
}

func (r team) AddTeamUsers(ctx context.Context, db *gorm.DB, teamId string, userIds []string) ([]*db_model.TeamUser, error) {
	entries := make([]*db_model.TeamUser, 0, len(userIds))
	for _, uid := range userIds {
		entries = append(entries, &db_model.TeamUser{
			TeamID: teamId,
			UserID: uid,
		})
	}

	if err := db.Create(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r team) DeleteTeamUsers(ctx context.Context, db *gorm.DB, teamId string, userIds []string) ([]*db_model.TeamUser, error) {
	var teamUsers []*db_model.TeamUser
	if err := db.Where("team_id = ? AND user_id IN (?)", teamId, userIds).Find(&teamUsers).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	
	if err := db.Where("team_id = ? AND user_id IN (?)", teamId, userIds).Delete(&db_model.TeamUser{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teamUsers, nil
}

func (r team) BatchGetTeamUsersByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.TeamUser, error) {
	var teamUsers []*db_model.TeamUser
	if err := db.Where("team_id IN (?)", teamIds).Find(&teamUsers).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teamUsers, nil
}

func (r team) BatchGetTeamUsersByUserIDs(ctx context.Context, db *gorm.DB, userIds []string) ([]*db_model.TeamUser, error) {
	var teamUsers []*db_model.TeamUser
	if err := db.Where("user_id IN (?)", userIds).Find(&teamUsers).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teamUsers, nil
}

func (r team) BatchGetTeamsByGroupIDs(ctx context.Context, db *gorm.DB, groupIds []string) ([]*db_model.Team, error) {
	var teams []*db_model.Team
	if err := db.Where("group_id IN (?)", groupIds).Find(&teams).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return teams, nil
}
