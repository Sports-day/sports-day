package service

import (
	"context"
	"database/sql"
	"sort"
	"strconv"
	"strings"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Promotion struct {
	db                      *gorm.DB
	promotionRuleRepository repository.PromotionRule
	competitionRepository   repository.Competition
	matchRepository         repository.Match
	leagueRepository        repository.League
	rankingRuleRepository   repository.RankingRule
}

func NewPromotion(
	db *gorm.DB,
	promotionRuleRepository repository.PromotionRule,
	competitionRepository repository.Competition,
	matchRepository repository.Match,
	leagueRepository repository.League,
	rankingRuleRepository repository.RankingRule,
) Promotion {
	return Promotion{
		db:                      db,
		promotionRuleRepository: promotionRuleRepository,
		competitionRepository:   competitionRepository,
		matchRepository:         matchRepository,
		leagueRepository:        leagueRepository,
		rankingRuleRepository:   rankingRuleRepository,
	}
}

func ParseRankSpec(spec string) ([]int, error) {
	spec = strings.TrimSpace(spec)
	if spec == "" {
		return nil, errors.ErrPromotionRuleInvalidRankSpec
	}

	if strings.Contains(spec, "-") {
		parts := strings.SplitN(spec, "-", 2)
		if len(parts) != 2 {
			return nil, errors.ErrPromotionRuleInvalidRankSpec
		}
		start, err := strconv.Atoi(strings.TrimSpace(parts[0]))
		if err != nil || start < 1 {
			return nil, errors.ErrPromotionRuleInvalidRankSpec
		}
		end, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil || end < 1 {
			return nil, errors.ErrPromotionRuleInvalidRankSpec
		}
		if start > end {
			return nil, errors.ErrPromotionRuleInvalidRankSpec
		}
		ranks := make([]int, 0, end-start+1)
		for i := start; i <= end; i++ {
			ranks = append(ranks, i)
		}
		return ranks, nil
	}

	if strings.Contains(spec, ",") {
		parts := strings.Split(spec, ",")
		ranks := make([]int, 0, len(parts))
		for _, p := range parts {
			v, err := strconv.Atoi(strings.TrimSpace(p))
			if err != nil || v < 1 {
				return nil, errors.ErrPromotionRuleInvalidRankSpec
			}
			ranks = append(ranks, v)
		}
		sort.Ints(ranks)
		return ranks, nil
	}

	v, err := strconv.Atoi(spec)
	if err != nil || v < 1 {
		return nil, errors.ErrPromotionRuleInvalidRankSpec
	}
	return []int{v}, nil
}

func (s *Promotion) CreateRule(ctx context.Context, input *model.CreatePromotionRuleInput) (*db_model.PromotionRule, error) {
	if _, err := ParseRankSpec(input.RankSpec); err != nil {
		return nil, err
	}

	if err := s.validateRuleModification(ctx, s.db, input.TargetCompetitionID); err != nil {
		return nil, err
	}

	var slotStart sql.NullInt64
	if input.SlotStart != nil {
		slotStart = sql.NullInt64{Valid: true, Int64: int64(*input.SlotStart)}
	}

	rule := &db_model.PromotionRule{
		ID:                  ulid.Make(),
		SourceCompetitionID: input.SourceCompetitionID,
		TargetCompetitionID: input.TargetCompetitionID,
		RankSpec:            input.RankSpec,
		SlotStart:           slotStart,
	}

	created, err := s.promotionRuleRepository.Save(ctx, s.db, rule)
	if err != nil {
		return nil, errors.ErrSavePromotionRule
	}
	return created, nil
}

func (s *Promotion) UpdateRule(ctx context.Context, id string, input *model.UpdatePromotionRuleInput) (*db_model.PromotionRule, error) {
	rule, err := s.promotionRuleRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, err
	}

	if err := s.validateRuleModification(ctx, s.db, rule.TargetCompetitionID); err != nil {
		return nil, err
	}

	if input.RankSpec != nil {
		if _, err := ParseRankSpec(*input.RankSpec); err != nil {
			return nil, err
		}
		rule.RankSpec = *input.RankSpec
	}
	if input.SlotStart != nil {
		rule.SlotStart = sql.NullInt64{Valid: true, Int64: int64(*input.SlotStart)}
	}

	var updated *db_model.PromotionRule

	err = s.db.Transaction(func(tx *gorm.DB) error {
		saved, err := s.promotionRuleRepository.Save(ctx, tx, rule)
		if err != nil {
			return errors.ErrSavePromotionRule
		}
		updated = saved

		if err := s.reconcileTarget(ctx, tx, rule.TargetCompetitionID); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return updated, nil
}

func (s *Promotion) DeleteRule(ctx context.Context, id string) (*db_model.PromotionRule, error) {
	rule, err := s.promotionRuleRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, err
	}

	if err := s.validateRuleModification(ctx, s.db, rule.TargetCompetitionID); err != nil {
		return nil, err
	}

	var deleted *db_model.PromotionRule

	err = s.db.Transaction(func(tx *gorm.DB) error {
		d, err := s.promotionRuleRepository.Delete(ctx, tx, id)
		if err != nil {
			return err
		}
		deleted = d

		if err := s.reconcileTarget(ctx, tx, rule.TargetCompetitionID); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return deleted, nil
}

func (s *Promotion) ListRulesByCompetitionID(ctx context.Context, competitionID string) ([]*db_model.PromotionRule, error) {
	return s.promotionRuleRepository.ListBySourceCompetitionID(ctx, s.db, competitionID)
}

func (s *Promotion) ValidateScoreModification(ctx context.Context, matchID string) error {
	return s.validateScoreModification(ctx, s.db, matchID)
}

func (s *Promotion) validateScoreModification(ctx context.Context, db *gorm.DB, matchID string) error {
	match, err := s.matchRepository.Get(ctx, db, matchID)
	if err != nil {
		return errors.Wrap(err)
	}

	rules, err := s.promotionRuleRepository.ListBySourceCompetitionID(ctx, db, match.CompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	for _, rule := range rules {
		if s.hasActiveMatches(ctx, db, rule.TargetCompetitionID) {
			return errors.ErrScoreModificationLocked
		}
	}

	return nil
}

func (s *Promotion) validateRuleModification(ctx context.Context, db *gorm.DB, targetCompetitionID string) error {
	if s.hasAnyScore(ctx, db, targetCompetitionID) {
		return errors.ErrPromotionRuleLocked
	}
	return nil
}

func (s *Promotion) hasAnyScore(ctx context.Context, db *gorm.DB, competitionID string) bool {
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, db, []string{competitionID})
	if err != nil || len(matches) == 0 {
		return false
	}

	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, db, matchIDs)
	if err != nil {
		return false
	}

	for _, e := range entries {
		if e.Score != 0 {
			return true
		}
	}
	return false
}

func (s *Promotion) hasActiveMatches(ctx context.Context, db *gorm.DB, competitionID string) bool {
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, db, []string{competitionID})
	if err != nil || len(matches) == 0 {
		return false
	}

	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, db, matchIDs)
	if err != nil {
		return false
	}

	for _, e := range entries {
		if e.Score != 0 {
			return true
		}
	}
	return false
}

func (s *Promotion) TryExecuteForCompetition(ctx context.Context, tx *gorm.DB, competitionID string) error {
	rules, err := s.promotionRuleRepository.ListBySourceCompetitionID(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{competitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	if !checkAllFinished(matches) {
		return nil
	}

	competition, err := s.competitionRepository.Get(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	if competition.Type != "LEAGUE" {
		return nil
	}

	standings, err := s.computeStandingsWithTx(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	for _, rule := range rules {
		targetRanks, err := ParseRankSpec(rule.RankSpec)
		if err != nil {
			continue
		}

		if !s.areTargetRanksResolved(standings, targetRanks) {
			continue
		}

		promotedTeamIDs := s.getTeamIDsByRanks(standings, targetRanks)
		if len(promotedTeamIDs) == 0 {
			continue
		}

		if err := s.createEntriesIdempotent(ctx, tx, rule, promotedTeamIDs); err != nil {
			return err
		}
	}

	targetCompetitionIDs := make(map[string]bool)
	for _, rule := range rules {
		targetCompetitionIDs[rule.TargetCompetitionID] = true
	}
	for targetID := range targetCompetitionIDs {
		if err := s.tryGenerateMatches(ctx, tx, targetID); err != nil {
			return err
		}
	}

	return nil
}

func (s *Promotion) computeStandingsWithTx(ctx context.Context, tx *gorm.DB, leagueID string) ([]rankedStats, error) {
	league, err := s.leagueRepository.Get(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	rules, err := s.rankingRuleRepository.ListByLeagueID(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if len(entries) == 0 {
		return nil, nil
	}

	teamIDs := make([]string, len(entries))
	for i, e := range entries {
		teamIDs[i] = e.TeamID
	}

	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	var matchEntries []*db_model.MatchEntry
	if len(matchIDs) > 0 {
		matchEntries, err = s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
		if err != nil {
			return nil, errors.Wrap(err)
		}
	}

	tiebreakPriorities, err := s.leagueRepository.ListTiebreakPrioritiesByLeagueID(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	stats := collectMatchStats(league, matches, matchEntries, teamIDs)
	allFinished := checkAllFinished(matches)
	useAverage := shouldUseAverage(stats, len(teamIDs))

	return rankTeams(stats, rules, matches, matchEntries, allFinished, tiebreakPriorities, useAverage), nil
}

func (s *Promotion) areTargetRanksResolved(standings []rankedStats, targetRanks []int) bool {
	rankTeamCount := make(map[int]int)
	for _, st := range standings {
		rankTeamCount[st.rank]++
	}

	for _, targetRank := range targetRanks {
		count, exists := rankTeamCount[targetRank]
		if !exists {
			return false
		}
		if count > 1 {
			return false
		}
	}
	return true
}

func (s *Promotion) getTeamIDsByRanks(standings []rankedStats, targetRanks []int) []string {
	targetRankSet := make(map[int]bool, len(targetRanks))
	for _, r := range targetRanks {
		targetRankSet[r] = true
	}

	type rankTeam struct {
		rank   int
		teamID string
	}

	var teams []rankTeam
	for _, st := range standings {
		if targetRankSet[st.rank] {
			teams = append(teams, rankTeam{rank: st.rank, teamID: st.teamID})
		}
	}

	sort.Slice(teams, func(i, j int) bool {
		return teams[i].rank < teams[j].rank
	})

	result := make([]string, len(teams))
	for i, t := range teams {
		result[i] = t.teamID
	}
	return result
}

func (s *Promotion) createEntriesIdempotent(ctx context.Context, tx *gorm.DB, rule *db_model.PromotionRule, teamIDs []string) error {
	existingEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.TargetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	existingTeams := make(map[string]bool, len(existingEntries))
	for _, e := range existingEntries {
		existingTeams[e.TeamID] = true
	}

	var newTeamIDs []string
	for _, teamID := range teamIDs {
		if !existingTeams[teamID] {
			newTeamIDs = append(newTeamIDs, teamID)
		}
	}

	if len(newTeamIDs) == 0 {
		return nil
	}

	if _, err := s.competitionRepository.AddCompetitionEntries(ctx, tx, rule.TargetCompetitionID, newTeamIDs); err != nil {
		return errors.Wrap(err)
	}

	return nil
}

func (s *Promotion) calculateExpectedTeamCount(ctx context.Context, tx *gorm.DB, targetCompetitionID string) (int, error) {
	rules, err := s.promotionRuleRepository.ListByTargetCompetitionID(ctx, tx, targetCompetitionID)
	if err != nil {
		return 0, errors.Wrap(err)
	}

	autoCount := 0
	for _, rule := range rules {
		ranks, err := ParseRankSpec(rule.RankSpec)
		if err != nil {
			continue
		}
		autoCount += len(ranks)
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return 0, errors.Wrap(err)
	}

	autoEntryTeams := make(map[string]bool)
	for _, rule := range rules {
		sourceEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.SourceCompetitionID})
		if err != nil {
			continue
		}
		for _, e := range sourceEntries {
			autoEntryTeams[e.TeamID] = true
		}
	}

	manualCount := 0
	for _, e := range entries {
		if !autoEntryTeams[e.TeamID] {
			manualCount++
		}
	}

	return autoCount + manualCount, nil
}

func (s *Promotion) tryGenerateMatches(ctx context.Context, tx *gorm.DB, targetCompetitionID string) error {
	expectedCount, err := s.calculateExpectedTeamCount(ctx, tx, targetCompetitionID)
	if err != nil {
		return err
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	if len(entries) < expectedCount || expectedCount < 2 {
		return nil
	}

	existingMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	if len(existingMatches) > 0 {
		return nil
	}

	competition, err := s.competitionRepository.Get(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	teamIDs := make([]string, len(entries))
	for i, e := range entries {
		teamIDs[i] = e.TeamID
	}

	if competition.Type == "LEAGUE" {
		return s.generateRoundRobinMatches(ctx, tx, targetCompetitionID, teamIDs)
	}

	if competition.Type == "TOURNAMENT" {
		return s.generateTournamentMatches(ctx, tx, targetCompetitionID, teamIDs)
	}

	return nil
}

func (s *Promotion) generateRoundRobinMatches(ctx context.Context, tx *gorm.DB, competitionID string, teamIDs []string) error {
	n := len(teamIDs)
	if n < 2 {
		return nil
	}

	var schedule [][2]string
	if n%2 == 0 {
		schedule = generateEvenRoundRobinSchedule(teamIDs)
	} else {
		schedule = generateOddRoundRobinSchedule(teamIDs)
	}

	now := time.Now()
	for i, matchup := range schedule {
		m := &db_model.Match{
			ID:            ulid.Make(),
			Time:          now.Add(time.Duration(i) * time.Hour),
			Status:        "STANDBY",
			CompetitionID: competitionID,
		}
		saved, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.Wrap(err)
		}

		if _, err := s.matchRepository.AddMatchEntries(ctx, tx, saved.ID, []string{matchup[0], matchup[1]}); err != nil {
			return errors.Wrap(err)
		}
	}

	return nil
}

func generateEvenRoundRobinSchedule(teamIDs []string) [][2]string {
	n := len(teamIDs)
	var schedule [][2]string

	teams := make([]string, n)
	copy(teams, teamIDs)

	for round := 0; round < n-1; round++ {
		for i := 0; i < n/2; i++ {
			schedule = append(schedule, [2]string{teams[i], teams[n-1-i]})
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

func generateOddRoundRobinSchedule(teamIDs []string) [][2]string {
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

func (s *Promotion) generateTournamentMatches(ctx context.Context, tx *gorm.DB, competitionID string, teamIDs []string) error {
	n := len(teamIDs)
	if n < 2 {
		return nil
	}

	rules, err := s.promotionRuleRepository.ListByTargetCompetitionID(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	slotMap := make(map[int]string)
	for _, rule := range rules {
		if !rule.SlotStart.Valid {
			continue
		}

		ranks, err := ParseRankSpec(rule.RankSpec)
		if err != nil {
			continue
		}

		sourceEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.SourceCompetitionID})
		if err != nil {
			continue
		}

		sourceMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{rule.SourceCompetitionID})
		if err != nil {
			continue
		}
		if !checkAllFinished(sourceMatches) {
			continue
		}

		sourceTeamIDs := make([]string, len(sourceEntries))
		for i, e := range sourceEntries {
			sourceTeamIDs[i] = e.TeamID
		}

		league, err := s.leagueRepository.Get(ctx, tx, rule.SourceCompetitionID)
		if err != nil {
			continue
		}

		rankingRules, err := s.rankingRuleRepository.ListByLeagueID(ctx, tx, rule.SourceCompetitionID)
		if err != nil {
			continue
		}

		matchIDs := make([]string, len(sourceMatches))
		for i, m := range sourceMatches {
			matchIDs[i] = m.ID
		}

		var matchEntries []*db_model.MatchEntry
		if len(matchIDs) > 0 {
			matchEntries, err = s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
			if err != nil {
				continue
			}
		}

		tiebreakPriorities, err := s.leagueRepository.ListTiebreakPrioritiesByLeagueID(ctx, tx, rule.SourceCompetitionID)
		if err != nil {
			continue
		}

		stats := collectMatchStats(league, sourceMatches, matchEntries, sourceTeamIDs)
		useAverage := shouldUseAverage(stats, len(sourceTeamIDs))
		standings := rankTeams(stats, rankingRules, sourceMatches, matchEntries, true, tiebreakPriorities, useAverage)

		promoted := make([]string, 0)
		for _, rank := range ranks {
			for _, st := range standings {
				if st.rank == rank {
					promoted = append(promoted, st.teamID)
				}
			}
		}

		slotStartVal := int(rule.SlotStart.Int64)
		for i, teamID := range promoted {
			slotMap[slotStartVal+i] = teamID
		}
	}

	orderedTeams := make([]string, 0, n)
	if len(slotMap) > 0 {
		slots := make([]int, 0, len(slotMap))
		for slot := range slotMap {
			slots = append(slots, slot)
		}
		sort.Ints(slots)
		for _, slot := range slots {
			orderedTeams = append(orderedTeams, slotMap[slot])
		}
		slottedTeams := make(map[string]bool)
		for _, teamID := range orderedTeams {
			slottedTeams[teamID] = true
		}
		for _, teamID := range teamIDs {
			if !slottedTeams[teamID] {
				orderedTeams = append(orderedTeams, teamID)
			}
		}
	} else {
		orderedTeams = teamIDs
	}

	now := time.Now()
	for i := 0; i+1 < len(orderedTeams); i += 2 {
		m := &db_model.Match{
			ID:            ulid.Make(),
			Time:          now.Add(time.Duration(i/2) * time.Hour),
			Status:        "STANDBY",
			CompetitionID: competitionID,
		}
		saved, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.Wrap(err)
		}

		if _, err := s.matchRepository.AddMatchEntries(ctx, tx, saved.ID, []string{orderedTeams[i], orderedTeams[i+1]}); err != nil {
			return errors.Wrap(err)
		}
	}

	return nil
}

func (s *Promotion) reconcileTarget(ctx context.Context, tx *gorm.DB, targetCompetitionID string) error {
	existingMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	hasScores := false
	if len(existingMatches) > 0 {
		matchIDs := make([]string, len(existingMatches))
		for i, m := range existingMatches {
			matchIDs[i] = m.ID
		}
		entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
		if err != nil {
			return errors.Wrap(err)
		}
		for _, e := range entries {
			if e.Score != 0 {
				hasScores = true
				break
			}
		}
	}

	if hasScores {
		return nil
	}

	if len(existingMatches) > 0 {
		for _, m := range existingMatches {
			if _, err := s.matchRepository.Delete(ctx, tx, m.ID); err != nil {
				return errors.Wrap(err)
			}
		}
	}

	existingEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	rules, err := s.promotionRuleRepository.ListByTargetCompetitionID(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	autoEntryTeams := make(map[string]bool)
	for _, rule := range rules {
		sourceRules, err := s.promotionRuleRepository.ListBySourceCompetitionID(ctx, tx, rule.SourceCompetitionID)
		if err != nil {
			continue
		}
		for _, sr := range sourceRules {
			if sr.TargetCompetitionID != targetCompetitionID {
				continue
			}
			sourceMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{sr.SourceCompetitionID})
			if err != nil || !checkAllFinished(sourceMatches) {
				continue
			}

			standings, err := s.computeStandingsWithTx(ctx, tx, sr.SourceCompetitionID)
			if err != nil {
				continue
			}

			ranks, err := ParseRankSpec(sr.RankSpec)
			if err != nil {
				continue
			}

			for _, teamID := range s.getTeamIDsByRanks(standings, ranks) {
				autoEntryTeams[teamID] = true
			}
		}
	}

	var autoEntriesToRemove []string
	for _, e := range existingEntries {
		if !autoEntryTeams[e.TeamID] {
			isManual := true
			for _, rule := range rules {
				srcEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.SourceCompetitionID})
				if err != nil {
					continue
				}
				for _, se := range srcEntries {
					if se.TeamID == e.TeamID {
						isManual = false
						break
					}
				}
				if !isManual {
					break
				}
			}
			if !isManual {
				autoEntriesToRemove = append(autoEntriesToRemove, e.TeamID)
			}
		}
	}

	if len(autoEntriesToRemove) > 0 {
		if _, err := s.competitionRepository.DeleteCompetitionEntries(ctx, tx, targetCompetitionID, autoEntriesToRemove); err != nil {
			return errors.Wrap(err)
		}
	}

	for teamID := range autoEntryTeams {
		found := false
		for _, e := range existingEntries {
			if e.TeamID == teamID {
				found = true
				break
			}
		}
		if !found {
			if _, err := s.competitionRepository.AddCompetitionEntries(ctx, tx, targetCompetitionID, []string{teamID}); err != nil {
				return errors.Wrap(err)
			}
		}
	}

	if err := s.tryGenerateMatches(ctx, tx, targetCompetitionID); err != nil {
		return err
	}

	return nil
}

func (s *Promotion) TryExecuteAfterScoreModification(ctx context.Context, tx *gorm.DB, competitionID string) error {
	rules, err := s.promotionRuleRepository.ListBySourceCompetitionID(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	for _, rule := range rules {
		if err := s.reconcileTarget(ctx, tx, rule.TargetCompetitionID); err != nil {
			return err
		}
	}

	return nil
}

