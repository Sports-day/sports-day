package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
)

type Competition interface {
	Save(ctx context.Context, db *gorm.DB, competition *db_model.Competition) (*db_model.Competition, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error)
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Competition, error)
	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Competition, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Competition, error)
	AddCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error)
	DeleteCompetitionEntries(ctx context.Context, db *gorm.DB, competitionId string, teamIds []string) ([]*db_model.CompetitionEntry, error)
	BatchGetCompetitionEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.CompetitionEntry, error)
	BatchGetCompetitionEntriesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.CompetitionEntry, error)
	BatchGetByLocationIDs(ctx context.Context, db *gorm.DB, locationIDs []string) ([]*db_model.Competition, error)
	FindBySceneID(ctx context.Context, db *gorm.DB, sceneID string) ([]*db_model.Competition, error)
	// Promotion rule methods
	GetPromotionRule(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	SavePromotionRule(ctx context.Context, db *gorm.DB, rule *db_model.PromotionRule) (*db_model.PromotionRule, error)
	DeletePromotionRule(ctx context.Context, db *gorm.DB, id string) (*db_model.PromotionRule, error)
	ListBySourceCompetitionID(ctx context.Context, db *gorm.DB, sourceCompetitionID string) ([]*db_model.PromotionRule, error)
	ListByTargetCompetitionID(ctx context.Context, db *gorm.DB, targetCompetitionID string) ([]*db_model.PromotionRule, error)
	MaxDisplayOrder(ctx context.Context, db *gorm.DB) (int, error)
	UpdateDisplayOrders(ctx context.Context, db *gorm.DB, items []DisplayOrderItem) error
}
