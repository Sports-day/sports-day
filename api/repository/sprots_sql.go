package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
)

type sportsRepository struct{}

func NewSports() Sports {
	return &sportsRepository{}
}
func (r *sportsRepository) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.First(&sport, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sport, nil
}

func (r *sportsRepository) List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error) {
	var sports []*db_model.Sport
	if err := db.Find(&sports).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (r *sportsRepository) Save(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error) {
	if err := db.Save(sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (r *sportsRepository) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.First(&sport, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.Delete(&sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sport, nil
}

func (r *sportsRepository) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Sport, error) {
	var sports []*db_model.Sport
	if err := db.Where("id IN ?", ids).Find(&sports).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (r *sportsRepository) ListRankingRules(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.RankingRule, error) {
	var rules []*db_model.RankingRule
	if err := db.Where("sport_id = ?", sportID).Order("priority ASC").Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r *sportsRepository) SetRankingRules(ctx context.Context, db *gorm.DB, sportID string, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error) {
	if err := db.Where("sport_id = ?", sportID).Delete(&db_model.RankingRule{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	if len(rules) > 0 {
		if err := db.Create(&rules).Error; err != nil {
			return nil, errors.Wrap(err)
		}
	}
	return rules, nil
}

func (r *sportsRepository) UpdateImageID(ctx context.Context, db *gorm.DB, sportID string, imageID string) error {
	return db.WithContext(ctx).
		Model(&db_model.Sport{}).
		Where("id = ?", sportID).
		Update("image_id", imageID).
		Error
}
