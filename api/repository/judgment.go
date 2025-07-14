package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Judgment interface {
	Save(ctx context.Context, db *gorm.DB, judgment *db_model.Judgment) (*db_model.Judgment, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Judgment, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Judgment, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Judgment, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Judgment, error)
	BatchGetJudgmentsByUserIDs(ctx context.Context, db *gorm.DB, userIds []string) ([]*db_model.Judgment, error)
	BatchGetJudgmentsByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.Judgment, error)
	BatchGetJudgmentsByGroupIDs(ctx context.Context, db *gorm.DB, groupIds []string) ([]*db_model.Judgment, error)
}
