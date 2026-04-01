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

type Sport struct {
	db               *gorm.DB
	sportsRepository repository.Sports
	imageService     *Image
}

func NewSports(
	db *gorm.DB,
	sportsRepository repository.Sports,
	imageService *Image,
) Sport {
	return Sport{
		db:               db,
		sportsRepository: sportsRepository,
		imageService:     imageService,
	}
}

func (s *Sport) Get(ctx context.Context, id string) (*db_model.Sport, error) {
	sport, err := s.sportsRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (s *Sport) List(ctx context.Context) ([]*db_model.Sport, error) {
	sports, err := s.sportsRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sports, nil
}

func (s *Sport) Create(ctx context.Context, input *model.CreateSportsInput) (*db_model.Sport, error) {
	sport := &db_model.Sport{
		ID:   ulid.Make(),
		Name: input.Name,
	}

	sport, err := s.sportsRepository.Save(ctx, s.db, sport)
	if err != nil {
		return nil, errors.ErrSaveSport
	}

	return sport, nil
}

func (s *Sport) Update(ctx context.Context, id string, input model.UpdateSportsInput) (*db_model.Sport, error) {
	// imageIdの存在確認はトランザクション外で行う（DB更新を伴わないため）
	if input.ImageID != nil {
		if _, err := s.imageService.Get(ctx, *input.ImageID); err != nil {
			return nil, err
		}
	}

	var result *db_model.Sport
	err := s.db.Transaction(func(tx *gorm.DB) error {
		sport, err := s.sportsRepository.Get(ctx, tx, id)
		if err != nil {
			return errors.Wrap(err)
		}

		if input.Name != nil {
			sport.Name = *input.Name
		}
		if input.Weight != nil {
			sport.Weight = int(*input.Weight)
		}

		sport, err = s.sportsRepository.Save(ctx, tx, sport)
		if err != nil {
			return errors.ErrSaveSport
		}

		if input.ImageID != nil {
			if err := s.sportsRepository.UpdateImageID(ctx, tx, id, *input.ImageID); err != nil {
				return errors.Wrap(err)
			}
			sport, err = s.sportsRepository.Get(ctx, tx, id)
			if err != nil {
				return errors.Wrap(err)
			}
		}

		result = sport
		return nil
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Sport) Delete(ctx context.Context, id string) (*db_model.Sport, error) {
	sport, err := s.sportsRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sport, nil
}

func (s *Sport) GetSportMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.Sport, error) {
	sports, err := s.sportsRepository.BatchGet(ctx, s.db, ids)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportMap := make(map[string]*db_model.Sport)
	for _, sport := range sports {
		sportMap[sport.ID] = sport
	}
	return sportMap, nil
}

func (s *Sport) GetRankingRules(ctx context.Context, sportID string) ([]*db_model.RankingRule, error) {
	rules, err := s.sportsRepository.ListRankingRules(ctx, s.db, sportID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (s *Sport) SetRankingRules(ctx context.Context, sportID string, rules []model.RankingRuleInput) ([]*db_model.RankingRule, error) {
	if len(rules) == 0 {
		return nil, errors.ErrRankingRuleInvalid
	}

	// priority 重複チェック
	seen := make(map[int32]bool)
	for _, r := range rules {
		if seen[r.Priority] {
			return nil, errors.ErrRankingRuleInvalid
		}
		seen[r.Priority] = true
	}

	// sport 存在確認
	if _, err := s.sportsRepository.Get(ctx, s.db, sportID); err != nil {
		return nil, errors.Wrap(err)
	}

	dbRules := make([]*db_model.RankingRule, len(rules))
	for i, r := range rules {
		dbRules[i] = &db_model.RankingRule{
			SportID:      sportID,
			ConditionKey: string(r.ConditionKey),
			Priority:     int(r.Priority),
		}
	}

	var result []*db_model.RankingRule
	err := s.db.Transaction(func(tx *gorm.DB) error {
		var txErr error
		result, txErr = s.sportsRepository.SetRankingRules(ctx, tx, sportID, dbRules)
		return txErr
	})
	if err != nil {
		return nil, errors.ErrSaveRankingRule
	}
	return result, nil
}

func (s *Sport) SetImage(ctx context.Context, sportID string, imageID string) error {
	_, err := s.imageService.Get(ctx, imageID)
	if err != nil {
		return err
	}

	return s.sportsRepository.UpdateImageID(
		ctx,
		s.db,
		sportID,
		imageID,
	)
}
