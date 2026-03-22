package service

import (
	"context"
	"database/sql"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type League struct {
	db                    *gorm.DB
	leagueRepository      repository.League
	matchRepository       repository.Match
	competitionRepository repository.Competition
	competitionService    *Competition
	rankingRuleRepository repository.RankingRule
}

func NewLeague(db *gorm.DB, leagueRepository repository.League, matchRepository repository.Match, competitionRepository repository.Competition, competitionService *Competition, rankingRuleRepository repository.RankingRule) League {
	return League{
		db:                    db,
		leagueRepository:      leagueRepository,
		matchRepository:       matchRepository,
		competitionRepository: competitionRepository,
		competitionService:    competitionService,
		rankingRuleRepository: rankingRuleRepository,
	}
}

func (s *League) Create(ctx context.Context, input *model.CreateLeagueInput) (*db_model.League, error) {
	var league *db_model.League

	err := s.db.Transaction(func(tx *gorm.DB) error {
		competitionID := ulid.Make()

		competition := &db_model.Competition{
			ID:   competitionID,
			Name: input.Name,
			Type: "LEAGUE",
		}

		if err := tx.Save(competition).Error; err != nil {
			return errors.Wrap(err)
		}

		league = &db_model.League{
			ID: competitionID,
		}

		if err := tx.Save(league).Error; err != nil {
			return errors.Wrap(err)
		}

		if input.RankingRules != nil && len(input.RankingRules) > 0 {
			if err := validateRankingRules(input.RankingRules); err != nil {
				return err
			}

			rules := make([]*db_model.RankingRule, len(input.RankingRules))
			for i, r := range input.RankingRules {
				rules[i] = &db_model.RankingRule{
					ID:           ulid.Make(),
					LeagueID:     competitionID,
					ConditionKey: string(r.ConditionKey),
					Priority:     int(r.Priority),
				}
			}

			if _, err := s.rankingRuleRepository.BatchCreate(ctx, tx, rules); err != nil {
				return errors.Wrap(err)
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return league, nil
}

func (s *League) Delete(ctx context.Context, id string) (*db_model.League, error) {
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.competitionService.Delete(ctx, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return league, nil
}

func (s *League) Get(ctx context.Context, id string) (*db_model.League, error) {
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return league, nil
}

func (s *League) List(ctx context.Context) ([]*db_model.League, error) {
	leagues, err := s.leagueRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return leagues, nil
}

func (s *League) UpdateLeaguePoints(ctx context.Context, id string, input *model.UpdateLeaguePointsInput) (*db_model.League, error) {
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.WinPt != nil {
		league.WinPt = int(*input.WinPt)
	}
	if input.DrawPt != nil {
		league.DrawPt = int(*input.DrawPt)
	}
	if input.LosePt != nil {
		league.LosePt = int(*input.LosePt)
	}

	updated, err := s.leagueRepository.Save(ctx, s.db, league)
	if err != nil {
		return nil, errors.ErrUpsertLeague
	}
	return updated, nil
}

func (s *League) GetLeaguesMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.League, error) {
	leagues, err := s.leagueRepository.BatchGet(ctx, s.db, ids)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	leagueMap := make(map[string]*db_model.League)
	for _, league := range leagues {
		leagueMap[league.ID] = league
	}
	return leagueMap, nil
}

func (s *League) SetRankingRules(ctx context.Context, leagueID string, input *model.SetRankingRulesInput) ([]*db_model.RankingRule, error) {
	if err := validateRankingRules(input.Rules); err != nil {
		return nil, err
	}

	_, err := s.leagueRepository.Get(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var created []*db_model.RankingRule

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.rankingRuleRepository.DeleteByLeagueID(ctx, tx, leagueID); err != nil {
			return errors.Wrap(err)
		}

		rules := make([]*db_model.RankingRule, len(input.Rules))
		for i, r := range input.Rules {
			rules[i] = &db_model.RankingRule{
				ID:           ulid.Make(),
				LeagueID:     leagueID,
				ConditionKey: string(r.ConditionKey),
				Priority:     int(r.Priority),
			}
		}

		created, err = s.rankingRuleRepository.BatchCreate(ctx, tx, rules)
		if err != nil {
			return errors.Wrap(err)
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return created, nil
}

func (s *League) GetRankingRulesMapByLeagueIDs(ctx context.Context, leagueIDs []string) (map[string][]*db_model.RankingRule, error) {
	rulesMap := make(map[string][]*db_model.RankingRule, len(leagueIDs))

	for _, id := range leagueIDs {
		rulesMap[id] = []*db_model.RankingRule{}
	}

	rows, err := s.rankingRuleRepository.BatchGetByLeagueIDs(ctx, s.db, leagueIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	for _, r := range rows {
		rulesMap[r.LeagueID] = append(rulesMap[r.LeagueID], r)
	}

	return rulesMap, nil
}

func validateRankingRules(rules []*model.RankingRuleInput) error {
	if len(rules) == 0 {
		return errors.ErrRankingRuleEmpty
	}

	conditionKeys := make(map[string]bool)
	priorities := make(map[int32]bool)

	for _, r := range rules {
		if conditionKeys[string(r.ConditionKey)] {
			return errors.ErrRankingRuleDuplicate
		}
		conditionKeys[string(r.ConditionKey)] = true

		if priorities[r.Priority] {
			return errors.ErrRankingRulePriority
		}
		priorities[r.Priority] = true
	}

	for i := int32(1); i <= int32(len(rules)); i++ {
		if !priorities[i] {
			return errors.ErrRankingRulePriority
		}
	}

	return nil
}

func (s *League) GenerateRoundRobin(ctx context.Context, competitionID string, input *model.GenerateRoundRobinInput) ([]*db_model.Match, error) {
	var createdMatches []*db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		entries, err := s.competitionRepository.
			BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{competitionID})
		if err != nil {
			return err
		}
		if len(entries) < 2 {
			return errors.ErrMakeLeagueMatches
		}

		teamIDs := make([]string, len(entries))
		for i, e := range entries {
			teamIDs[i] = e.TeamID
		}

		startTime, err := time.Parse(time.RFC3339, input.StartTime)
		if err != nil {
			return errors.Wrap(err)
		}

		var locationID sql.NullString
		if input.LocationID != nil {
			locationID = sql.NullString{Valid: true, String: *input.LocationID}
		} else {
			locationID = sql.NullString{Valid: false}
		}

		schedule := s.generateOptimizedRoundRobinSchedule(teamIDs)

		for matchIndex, matchup := range schedule {
			matchTime := startTime.Add(time.Duration(matchIndex) * (time.Duration(input.MatchDuration+input.BreakDuration) * time.Minute))

			m := &db_model.Match{
				ID:            ulid.Make(),
				Time:          matchTime,
				Status:        "STANDBY",
				CompetitionID: competitionID,
				LocationID:    locationID,
			}
			saved, err := s.matchRepository.Save(ctx, tx, m)
			if err != nil {
				return err
			}

			if _, err := s.matchRepository.AddMatchEntries(
				ctx, tx,
				saved.ID,
				[]string{matchup[0], matchup[1]},
			); err != nil {
				return err
			}

			createdMatches = append(createdMatches, saved)
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return createdMatches, nil
}

func (s *League) generateOptimizedRoundRobinSchedule(teamIDs []string) [][2]string {
	n := len(teamIDs)
	if n < 2 {
		return nil
	}

	if n%2 == 0 {
		return s.generateEvenRoundRobin(teamIDs)
	} else {
		return s.generateOddRoundRobin(teamIDs)
	}
}

func (s *League) generateEvenRoundRobin(teamIDs []string) [][2]string {
	n := len(teamIDs)
	var schedule [][2]string

	teams := make([]string, n)
	copy(teams, teamIDs)

	for round := 0; round < n-1; round++ {
		for i := 0; i < n/2; i++ {
			team1 := teams[i]
			team2 := teams[n-1-i]
			schedule = append(schedule, [2]string{team1, team2})
		}

		if n > 2 {
			temp := teams[n-1]
			for i := n - 1; i > 1; i-- {
				teams[i] = teams[i-1]
			}
			teams[1] = temp
		}
	}

	return schedule
}

func (s *League) generateOddRoundRobin(teamIDs []string) [][2]string {
	n := len(teamIDs)
	var schedule [][2]string

	teams := make([]string, n)
	copy(teams, teamIDs)

	for round := 0; round < n; round++ {
		for i := 0; i < n/2; i++ {
			team1Idx := (round + i) % n
			team2Idx := (round + n - 1 - i) % n

			if team1Idx != team2Idx {
				schedule = append(schedule, [2]string{teams[team1Idx], teams[team2Idx]})
			}
		}
	}

	return schedule
}
