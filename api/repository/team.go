package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Team interface {
	Save(ctx context.Context, db *gorm.DB, team *db_model.Team) (*db_model.Team, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Team, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Team, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Team, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Team, error)
	AddTeamUsers(ctx context.Context, db *gorm.DB, teamId string, userIds []string) ([]*db_model.TeamUser, error)
	DeleteTeamUsers(ctx context.Context, db *gorm.DB, teamId string, userIds []string) ([]*db_model.TeamUser, error)
	BatchGetTeamUsersByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.TeamUser, error)
	BatchGetTeamUsersByUserIDs(ctx context.Context, db *gorm.DB, userIds []string) ([]*db_model.TeamUser, error)
	BatchGetTeamsByGroupIDs(ctx context.Context, db *gorm.DB, groupIds []string) ([]*db_model.Team, error)
}
