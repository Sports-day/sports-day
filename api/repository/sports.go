package repository

import (
	"context"

	"sports-day/api/db_model"

	"gorm.io/gorm"
)

type Sports interface {
	Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)
	List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error)
	Save(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error)
	Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error)

	BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Sport, error)
	ListRankingRules(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.RankingRule, error)
	SetRankingRules(ctx context.Context, db *gorm.DB, sportID string, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error)
	UpdateImageID(
		ctx context.Context,
		db *gorm.DB,
		sportID string,
		imageID string,
	) error

	ListAllExperiences(ctx context.Context, db *gorm.DB) ([]*db_model.SportExperience, error)
	ListExperiencesBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportExperience, error)
	ListExperiencesByUserID(ctx context.Context, db *gorm.DB, userID string) ([]*db_model.SportExperience, error)
	AddExperiences(ctx context.Context, db *gorm.DB, sportID string, userIDs []string) ([]*db_model.SportExperience, error)
	DeleteExperiences(ctx context.Context, db *gorm.DB, sportID string, userIDs []string) error
	// 指定sportに登録されているチームごとの経験者数の最大値を返す
	MaxExperiencedCountPerTeam(ctx context.Context, db *gorm.DB, sportID string) (int, error)
}
