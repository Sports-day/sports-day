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

type Rule struct {
	db             *gorm.DB
	ruleRepository repository.Rule
}

func NewRule(db *gorm.DB, ruleRepository repository.Rule) Rule {
	return Rule{
		db:             db,
		ruleRepository: ruleRepository,
	}
}

func (s *Rule) Get(ctx context.Context, id string) (*db_model.Rule, error) {
	rule, err := s.ruleRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (s *Rule) List(ctx context.Context) ([]*db_model.Rule, error) {
	rules, err := s.ruleRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
}

func (s *Rule) Create(ctx context.Context, input *model.CreateRuleInput) (*db_model.Rule, error) {
	rule := &db_model.Rule{
		ID:   ulid.Make(),
		Rule: input.Rule,
	}
	rule, err := s.ruleRepository.Save(ctx, s.db, rule)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (s *Rule) Update(ctx context.Context, id string, input model.UpdateRuleInput) (*db_model.Rule, error) {
	rule, err := s.ruleRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Rule != nil {
		rule.Rule = *input.Rule
	}

	rule, err = s.ruleRepository.Save(ctx, s.db, rule)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

func (s *Rule) Delete(ctx context.Context, id string) (*db_model.Rule, error) {
	rule, err := s.ruleRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}
