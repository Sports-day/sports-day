package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	pkggorm "sports-day/api/pkg/gorm"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Judgment struct {
	db                 *gorm.DB
	judgmentRepository repository.Judgment
}

func NewJudgment(db *gorm.DB, judgmentRepository repository.Judgment) Judgment {
	return Judgment{
		db:                 db,
		judgmentRepository: judgmentRepository,
	}
}

func (s *Judgment) Get(ctx context.Context, id string) (*db_model.Judgment, error) {
	judgment, err := s.judgmentRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return judgment, nil
}

func (s *Judgment) Update(ctx context.Context, id string, input model.UpdateJudgmentInput) (*db_model.Judgment, error) {
	judgment, err := s.judgmentRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Entry != nil {
		e := input.Entry

		// バリデーション: User, Team, Group のうち1つ以下が指定されているかチェック
		count := 0
		if e.UserID != nil {
			count++
		}
		if e.TeamID != nil {
			count++
		}
		if e.GroupID != nil {
			count++
		}
		if e.Name != nil {
			count++
		}

		// 1つ以下の場合のみ処理を続行（0個も許可、2個以上はエラー）
		if count <= 1 {
			// nameはJudgmentEntryから取得
			judgment.Name = pkggorm.ToNullString(e.Name)
			judgment.UserID = pkggorm.ToNullString(e.UserID)
			judgment.TeamID = pkggorm.ToNullString(e.TeamID)
			judgment.GroupID = pkggorm.ToNullString(e.GroupID)
		} else {
			// 複数指定されている場合はエラー
			return nil, errors.ErrJudgmentEntryInvalid
		}
	}

	judgment, err = s.judgmentRepository.Save(ctx, s.db, judgment)
	if err != nil {
		return nil, errors.ErrSaveJudgment
	}
	return judgment, nil
}

func (s *Judgment) List(ctx context.Context) ([]*db_model.Judgment, error) {
	judgments, err := s.judgmentRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return judgments, nil
}

func (s *Judgment) GetJudgmentMapByIDs(ctx context.Context, judgmentIDs []string) (map[string]*db_model.Judgment, error) {
	judgments, err := s.judgmentRepository.BatchGet(ctx, s.db, judgmentIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	judgmentMap := make(map[string]*db_model.Judgment)
	for _, judgment := range judgments {
		judgmentMap[judgment.ID] = judgment
	}
	return judgmentMap, nil
}

func (s *Judgment) GetJudgmentsMapByUserIDs(ctx context.Context, userIds []string) (map[string][]*db_model.Judgment, error) {
	judgments, err := s.judgmentRepository.BatchGetJudgmentsByUserIDs(ctx, s.db, userIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	userJudgmentsMap := make(map[string][]*db_model.Judgment, len(userIds))
	for _, userId := range userIds {
		userJudgmentsMap[userId] = []*db_model.Judgment{}
	}

	for _, judgment := range judgments {
		if !judgment.UserID.Valid {
			continue
		}
		userJudgmentsMap[judgment.UserID.String] = append(userJudgmentsMap[judgment.UserID.String], judgment)
	}
	return userJudgmentsMap, nil
}

func (s *Judgment) GetJudgmentsMapByTeamIDs(ctx context.Context, teamIds []string) (map[string][]*db_model.Judgment, error) {
	judgments, err := s.judgmentRepository.BatchGetJudgmentsByTeamIDs(ctx, s.db, teamIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	teamJudgmentsMap := make(map[string][]*db_model.Judgment, len(teamIds))
	for _, teamid := range teamIds {
		teamJudgmentsMap[teamid] = []*db_model.Judgment{}
	}

	for _, judgment := range judgments {
		if !judgment.TeamID.Valid {
			continue
		}
		teamJudgmentsMap[judgment.TeamID.String] = append(teamJudgmentsMap[judgment.TeamID.String], judgment)
	}

	return teamJudgmentsMap, nil
}

func (s *Judgment) GetJudgmentsMapByGroupIDs(ctx context.Context, groupIds []string) (map[string][]*db_model.Judgment, error) {
	judgments, err := s.judgmentRepository.BatchGetJudgmentsByGroupIDs(ctx, s.db, groupIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	groupJudgmentsMap := make(map[string][]*db_model.Judgment, len(groupIds))
	for _, groupId := range groupIds {
		groupJudgmentsMap[groupId] = []*db_model.Judgment{}
	}

	for _, judgment := range judgments {
		if !judgment.GroupID.Valid {
			continue
		}
		groupJudgmentsMap[judgment.GroupID.String] = append(groupJudgmentsMap[judgment.GroupID.String], judgment)
	}

	return groupJudgmentsMap, nil
}
