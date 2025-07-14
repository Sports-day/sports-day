package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
)

type judgment struct{}

func NewJudgment() Judgment {
	return judgment{}
}

func (r judgment) Save(ctx context.Context, db *gorm.DB, judgment *db_model.Judgment) (*db_model.Judgment, error) {
	if err := db.Save(judgment).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgment, nil
}

func (r judgment) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Judgment, error) {
	var judgment db_model.Judgment
	if err := db.First(&judgment, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrJudgmentNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.Delete(&judgment).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &judgment, nil
}

func (r judgment) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Judgment, error) {
	var judgment db_model.Judgment
	if err := db.First(&judgment, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrJudgmentNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &judgment, nil
}

func (r judgment) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Judgment, error) {
	var judgments []*db_model.Judgment
	if err := db.Where("id IN ?", ids).Find(&judgments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}

func (r judgment) List(ctx context.Context, db *gorm.DB) ([]*db_model.Judgment, error) {
	var judgments []*db_model.Judgment
	if err := db.Find(&judgments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}

func (r judgment) BatchGetJudgmentsByUserIDs(ctx context.Context, db *gorm.DB, userIds []string) ([]*db_model.Judgment, error) {
	var judgments []*db_model.Judgment
	if err := db.WithContext(ctx).Where("user_id IN ?", userIds).Find(&judgments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}

func (r judgment) BatchGetJudgmentsByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.Judgment, error) {
	var judgments []*db_model.Judgment
	if err := db.WithContext(ctx).Where("team_id IN ?", teamIds).Find(&judgments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}

func (r judgment) BatchGetJudgmentsByGroupIDs(ctx context.Context, db *gorm.DB, groupIds []string) ([]*db_model.Judgment, error) {
	var judgments []*db_model.Judgment
	if err := db.WithContext(ctx).Where("group_id IN ?", groupIds).Find(&judgments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}
