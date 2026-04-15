package repository

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type sports struct{}

func NewSports() Sports {
	return sports{}
}
func (r sports) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.WithContext(ctx).First(&sport, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &sport, nil
}

func (r sports) List(ctx context.Context, db *gorm.DB) ([]*db_model.Sport, error) {
	var sports []*db_model.Sport
	if err := db.WithContext(ctx).Order("display_order ASC").Find(&sports).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (r sports) MaxDisplayOrder(ctx context.Context, db *gorm.DB) (int, error) {
	var max int
	err := db.WithContext(ctx).Model(&db_model.Sport{}).Select("COALESCE(MAX(display_order), 0)").Scan(&max).Error
	if err != nil {
		return 0, errors.Wrap(err)
	}
	return max, nil
}

func (r sports) UpdateDisplayOrders(ctx context.Context, db *gorm.DB, items []DisplayOrderItem) error {
	return db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, item := range items {
			if err := tx.Model(&db_model.Sport{}).Where("id = ?", item.ID).
				Update("display_order", item.DisplayOrder).Error; err != nil {
				return errors.Wrap(err)
			}
		}
		return nil
	})
}

func (r sports) Save(ctx context.Context, db *gorm.DB, sport *db_model.Sport) (*db_model.Sport, error) {
	if err := db.WithContext(ctx).Save(sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (r sports) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Sport, error) {
	var sport db_model.Sport
	if err := db.WithContext(ctx).First(&sport, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrSportNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.WithContext(ctx).Delete(&sport).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &sport, nil
}

func (r sports) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Sport, error) {
	var sports []*db_model.Sport
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&sports).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (r sports) ListRankingRules(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.RankingRule, error) {
	var rules []*db_model.RankingRule
	if err := db.WithContext(ctx).Where("sport_id = ?", sportID).Order("priority ASC").Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r sports) ListRankingRulesBySportIDs(ctx context.Context, db *gorm.DB, sportIDs []string) ([]*db_model.RankingRule, error) {
	if len(sportIDs) == 0 {
		return []*db_model.RankingRule{}, nil
	}
	var rules []*db_model.RankingRule
	if err := db.WithContext(ctx).Where("sport_id IN ?", sportIDs).Order("priority ASC").Find(&rules).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r sports) SetRankingRules(ctx context.Context, db *gorm.DB, sportID string, rules []*db_model.RankingRule) ([]*db_model.RankingRule, error) {
	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("sport_id = ?", sportID).Delete(&db_model.RankingRule{}).Error; err != nil {
			return err
		}
		if len(rules) > 0 {
			if err := tx.Create(&rules).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (r sports) UpdateImageID(ctx context.Context, db *gorm.DB, sportID string, imageID string) error {
	if err := db.WithContext(ctx).
		Model(&db_model.Sport{}).
		Where("id = ?", sportID).
		Update("image_id", imageID).
		Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r sports) ClearImageID(ctx context.Context, db *gorm.DB, sportID string) error {
	if err := db.WithContext(ctx).
		Model(&db_model.Sport{}).
		Where("id = ?", sportID).
		Update("image_id", nil).
		Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r sports) ListAllExperiences(ctx context.Context, db *gorm.DB) ([]*db_model.SportExperience, error) {
	var exps []*db_model.SportExperience
	if err := db.WithContext(ctx).Find(&exps).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return exps, nil
}

func (r sports) ListExperiencesBySportID(ctx context.Context, db *gorm.DB, sportID string) ([]*db_model.SportExperience, error) {
	var exps []*db_model.SportExperience
	if err := db.WithContext(ctx).Where("sport_id = ?", sportID).Find(&exps).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return exps, nil
}

func (r sports) ListExperiencesByUserID(ctx context.Context, db *gorm.DB, userID string) ([]*db_model.SportExperience, error) {
	var exps []*db_model.SportExperience
	if err := db.WithContext(ctx).Where("user_id = ?", userID).Find(&exps).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return exps, nil
}

func (r sports) AddExperiences(ctx context.Context, db *gorm.DB, sportID string, userIDs []string) ([]*db_model.SportExperience, error) {
	if len(userIDs) == 0 {
		return []*db_model.SportExperience{}, nil
	}
	exps := make([]*db_model.SportExperience, len(userIDs))
	for i, uid := range userIDs {
		exps[i] = &db_model.SportExperience{UserID: uid, SportID: sportID}
	}
	// 既に存在するレコードは無視する
	if err := db.WithContext(ctx).Clauses(clause.Insert{Modifier: "IGNORE"}).Create(&exps).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return exps, nil
}

func (r sports) DeleteExperiences(ctx context.Context, db *gorm.DB, sportID string, userIDs []string) error {
	if len(userIDs) == 0 {
		return nil
	}
	if err := db.WithContext(ctx).Where("sport_id = ? AND user_id IN ?", sportID, userIDs).Delete(&db_model.SportExperience{}).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r sports) MaxExperiencedCountPerTeam(ctx context.Context, db *gorm.DB, sportID string) (int, error) {
	var maxCount int64
	// sport_scenes → sport_entries → teams → team_users と sport_experiences を結合して
	// チームごとの経験者数の最大値を取得
	err := db.WithContext(ctx).Raw(`
		SELECT COALESCE(MAX(cnt), 0) FROM (
			SELECT se.team_id, COUNT(*) AS cnt
			FROM sport_entries se
			JOIN sport_scenes ss ON se.sport_scene_id = ss.id
			JOIN team_users tu ON se.team_id = tu.team_id
			JOIN sport_experiences sx ON tu.user_id = sx.user_id AND sx.sport_id = ss.sport_id
			WHERE ss.sport_id = ?
			GROUP BY se.team_id
		) sub
	`, sportID).Scan(&maxCount).Error
	if err != nil {
		return 0, errors.Wrap(err)
	}
	return int(maxCount), nil
}
