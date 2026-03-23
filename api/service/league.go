package service

import (
	"context"
	"database/sql"
	"sort"
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

func (s *League) ListRankingRulesByLeagueID(ctx context.Context, leagueID string) ([]*db_model.RankingRule, error) {
	rules, err := s.rankingRuleRepository.ListByLeagueID(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rules, nil
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

type teamStats struct {
	teamID        string
	win           int
	draw          int
	lose          int
	goalsFor      int
	goalsAgainst  int
	goalDiff      int
	points        int
	matchesPlayed int
}

func (s *League) ComputeStandings(ctx context.Context, leagueID string) ([]*model.ComputedStanding, error) {
	league, err := s.leagueRepository.Get(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	rules, err := s.rankingRuleRepository.ListByLeagueID(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, s.db, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if len(entries) == 0 {
		return []*model.ComputedStanding{}, nil
	}

	teamIDs := make([]string, len(entries))
	for i, e := range entries {
		teamIDs[i] = e.TeamID
	}

	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, s.db, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	var matchEntries []*db_model.MatchEntry
	if len(matchIDs) > 0 {
		matchEntries, err = s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, matchIDs)
		if err != nil {
			return nil, errors.Wrap(err)
		}
	}

	tiebreakPriorities, err := s.leagueRepository.ListTiebreakPrioritiesByLeagueID(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	stats := collectMatchStats(league, matches, matchEntries, teamIDs)

	allFinished := checkAllFinished(matches)
	useAverage := shouldUseAverage(stats, len(teamIDs))

	sortedTeams := rankTeams(stats, rules, matches, matchEntries, allFinished, tiebreakPriorities, useAverage)

	result := make([]*model.ComputedStanding, len(sortedTeams))
	for i, ts := range sortedTeams {
		result[i] = &model.ComputedStanding{
			TeamID:        ts.teamID,
			Rank:          int32(ts.rank),
			Win:           int32(ts.win),
			Draw:          int32(ts.draw),
			Lose:          int32(ts.lose),
			GoalsFor:      int32(ts.goalsFor),
			GoalsAgainst:  int32(ts.goalsAgainst),
			GoalDiff:      int32(ts.goalDiff),
			Points:        int32(ts.points),
			MatchesPlayed: int32(ts.matchesPlayed),
		}
	}

	return result, nil
}

type rankedStats struct {
	teamStats
	rank int
}

func collectMatchStats(league *db_model.League, matches []*db_model.Match, matchEntries []*db_model.MatchEntry, teamIDs []string) map[string]*teamStats {
	stats := make(map[string]*teamStats, len(teamIDs))
	for _, id := range teamIDs {
		stats[id] = &teamStats{teamID: id}
	}

	entriesByMatch := make(map[string][]*db_model.MatchEntry)
	for _, e := range matchEntries {
		entriesByMatch[e.MatchID] = append(entriesByMatch[e.MatchID], e)
	}

	for _, m := range matches {
		if m.Status != "FINISHED" {
			continue
		}

		me := entriesByMatch[m.ID]
		if len(me) != 2 {
			continue
		}

		e1, e2 := me[0], me[1]
		if !e1.TeamID.Valid || !e2.TeamID.Valid {
			continue
		}

		t1, t2 := e1.TeamID.String, e2.TeamID.String
		s1, s2 := stats[t1], stats[t2]
		if s1 == nil || s2 == nil {
			continue
		}

		s1.matchesPlayed++
		s2.matchesPlayed++
		s1.goalsFor += e1.Score
		s1.goalsAgainst += e2.Score
		s2.goalsFor += e2.Score
		s2.goalsAgainst += e1.Score
		s1.goalDiff = s1.goalsFor - s1.goalsAgainst
		s2.goalDiff = s2.goalsFor - s2.goalsAgainst

		switch {
		case e1.Score > e2.Score:
			s1.win++
			s2.lose++
			s1.points += league.WinPt
			s2.points += league.LosePt
		case e1.Score < e2.Score:
			s1.lose++
			s2.win++
			s1.points += league.LosePt
			s2.points += league.WinPt
		default:
			s1.draw++
			s2.draw++
			s1.points += league.DrawPt
			s2.points += league.DrawPt
		}
	}

	return stats
}

func checkAllFinished(matches []*db_model.Match) bool {
	if len(matches) == 0 {
		return false
	}
	for _, m := range matches {
		if m.Status != "FINISHED" {
			return false
		}
	}
	return true
}

func shouldUseAverage(stats map[string]*teamStats, teamCount int) bool {
	if teamCount%2 == 0 {
		return false
	}
	played := -1
	for _, s := range stats {
		if played == -1 {
			played = s.matchesPlayed
		} else if s.matchesPlayed != played {
			return true
		}
	}
	return false
}

func rankTeams(
	stats map[string]*teamStats,
	rules []*db_model.RankingRule,
	matches []*db_model.Match,
	matchEntries []*db_model.MatchEntry,
	allFinished bool,
	tiebreakPriorities []*db_model.TiebreakPriority,
	useAverage bool,
) []rankedStats {
	teamList := make([]*teamStats, 0, len(stats))
	for _, s := range stats {
		teamList = append(teamList, s)
	}

	groups := []teamGroup{{teams: teamList}}

	for _, rule := range rules {
		var newGroups []teamGroup
		for _, g := range groups {
			if len(g.teams) <= 1 {
				newGroups = append(newGroups, g)
				continue
			}
			split := applyRankingCondition(g.teams, rule.ConditionKey, matches, matchEntries, tiebreakPriorities, allFinished, useAverage)
			newGroups = append(newGroups, split...)
		}
		groups = newGroups
	}

	if allFinished {
		groups = applyImplicitAdminDecision(groups, tiebreakPriorities)
	}

	return assignRanks(groups)
}

type teamGroup struct {
	teams []*teamStats
}

func applyRankingCondition(
	teams []*teamStats,
	conditionKey string,
	matches []*db_model.Match,
	matchEntries []*db_model.MatchEntry,
	tiebreakPriorities []*db_model.TiebreakPriority,
	allFinished bool,
	useAverage bool,
) []teamGroup {
	switch conditionKey {
	case "WIN_POINTS":
		return splitByMetric(teams, func(s *teamStats) int { return s.points }, useAverage, func(s *teamStats) int { return s.matchesPlayed })
	case "GOAL_DIFF":
		return splitByMetric(teams, func(s *teamStats) int { return s.goalDiff }, useAverage, func(s *teamStats) int { return s.matchesPlayed })
	case "TOTAL_GOALS":
		return splitByMetric(teams, func(s *teamStats) int { return s.goalsFor }, useAverage, func(s *teamStats) int { return s.matchesPlayed })
	case "HEAD_TO_HEAD":
		return resolveHeadToHead(teams, matches, matchEntries)
	case "ADMIN_DECISION":
		if allFinished {
			return splitByTiebreakPriority(teams, tiebreakPriorities)
		}
		return []teamGroup{{teams: teams}}
	default:
		return []teamGroup{{teams: teams}}
	}
}

func splitByMetric(teams []*teamStats, getValue func(*teamStats) int, useAverage bool, getMatchesPlayed func(*teamStats) int) []teamGroup {
	sorted := make([]*teamStats, len(teams))
	copy(sorted, teams)

	sort.SliceStable(sorted, func(i, j int) bool {
		if useAverage {
			mi := getMatchesPlayed(sorted[i])
			mj := getMatchesPlayed(sorted[j])
			if mi == 0 && mj == 0 {
				return false
			}
			if mi == 0 {
				return false
			}
			if mj == 0 {
				return true
			}
			return int64(getValue(sorted[i]))*int64(mj) > int64(getValue(sorted[j]))*int64(mi)
		}
		return getValue(sorted[i]) > getValue(sorted[j])
	})

	var groups []teamGroup
	current := [](*teamStats){sorted[0]}

	for k := 1; k < len(sorted); k++ {
		equal := false
		if useAverage {
			mi := getMatchesPlayed(sorted[k-1])
			mj := getMatchesPlayed(sorted[k])
			if mi == 0 && mj == 0 {
				equal = true
			} else if mi > 0 && mj > 0 {
				equal = int64(getValue(sorted[k-1]))*int64(mj) == int64(getValue(sorted[k]))*int64(mi)
			}
		} else {
			equal = getValue(sorted[k-1]) == getValue(sorted[k])
		}

		if equal {
			current = append(current, sorted[k])
		} else {
			groups = append(groups, teamGroup{teams: current})
			current = []*teamStats{sorted[k]}
		}
	}
	groups = append(groups, teamGroup{teams: current})

	return groups
}

func resolveHeadToHead(teams []*teamStats, matches []*db_model.Match, matchEntries []*db_model.MatchEntry) []teamGroup {
	if len(teams) == 2 {
		return resolveHeadToHead2(teams, matches, matchEntries)
	}
	return resolveHeadToHeadMulti(teams, matches, matchEntries)
}

func resolveHeadToHead2(teams []*teamStats, matches []*db_model.Match, matchEntries []*db_model.MatchEntry) []teamGroup {
	t1, t2 := teams[0].teamID, teams[1].teamID

	entriesByMatch := buildEntriesByMatch(matchEntries)
	finishedIDs := buildFinishedMatchIDs(matches)

	for matchID := range finishedIDs {
		me := entriesByMatch[matchID]
		if len(me) != 2 {
			continue
		}
		e1, e2 := me[0], me[1]
		if !e1.TeamID.Valid || !e2.TeamID.Valid {
			continue
		}
		a, b := e1.TeamID.String, e2.TeamID.String
		if (a == t1 && b == t2) || (a == t2 && b == t1) {
			var scoreT1, scoreT2 int
			if a == t1 {
				scoreT1, scoreT2 = e1.Score, e2.Score
			} else {
				scoreT1, scoreT2 = e2.Score, e1.Score
			}

			if scoreT1 > scoreT2 {
				return []teamGroup{{teams: []*teamStats{teams[0]}}, {teams: []*teamStats{teams[1]}}}
			} else if scoreT2 > scoreT1 {
				return []teamGroup{{teams: []*teamStats{teams[1]}}, {teams: []*teamStats{teams[0]}}}
			}
			return []teamGroup{{teams: teams}}
		}
	}

	return []teamGroup{{teams: teams}}
}

func resolveHeadToHeadMulti(teams []*teamStats, matches []*db_model.Match, matchEntries []*db_model.MatchEntry) []teamGroup {
	teamSet := make(map[string]bool, len(teams))
	for _, t := range teams {
		teamSet[t.teamID] = true
	}

	h2hPoints := make(map[string]int, len(teams))
	for _, t := range teams {
		h2hPoints[t.teamID] = 0
	}

	entriesByMatch := buildEntriesByMatch(matchEntries)
	finishedIDs := buildFinishedMatchIDs(matches)

	for matchID := range finishedIDs {
		me := entriesByMatch[matchID]
		if len(me) != 2 {
			continue
		}
		e1, e2 := me[0], me[1]
		if !e1.TeamID.Valid || !e2.TeamID.Valid {
			continue
		}
		a, b := e1.TeamID.String, e2.TeamID.String
		if !teamSet[a] || !teamSet[b] {
			continue
		}

		switch {
		case e1.Score > e2.Score:
			h2hPoints[a] += 3
		case e1.Score < e2.Score:
			h2hPoints[b] += 3
		default:
			h2hPoints[a] += 1
			h2hPoints[b] += 1
		}
	}

	teamMap := make(map[string]*teamStats, len(teams))
	for _, t := range teams {
		teamMap[t.teamID] = t
	}

	sorted := make([]*teamStats, len(teams))
	copy(sorted, teams)
	sort.SliceStable(sorted, func(i, j int) bool {
		return h2hPoints[sorted[i].teamID] > h2hPoints[sorted[j].teamID]
	})

	var groups []teamGroup
	current := []*teamStats{sorted[0]}
	for k := 1; k < len(sorted); k++ {
		if h2hPoints[sorted[k-1].teamID] == h2hPoints[sorted[k].teamID] {
			current = append(current, sorted[k])
		} else {
			groups = append(groups, teamGroup{teams: current})
			current = []*teamStats{sorted[k]}
		}
	}
	groups = append(groups, teamGroup{teams: current})

	return groups
}

func splitByTiebreakPriority(teams []*teamStats, priorities []*db_model.TiebreakPriority) []teamGroup {
	priorityMap := make(map[string]int)
	for _, p := range priorities {
		priorityMap[p.TeamID] = p.Priority
	}

	allHavePriority := true
	for _, t := range teams {
		if _, ok := priorityMap[t.teamID]; !ok {
			allHavePriority = false
			break
		}
	}

	if !allHavePriority {
		return []teamGroup{{teams: teams}}
	}

	sorted := make([]*teamStats, len(teams))
	copy(sorted, teams)
	sort.SliceStable(sorted, func(i, j int) bool {
		return priorityMap[sorted[i].teamID] < priorityMap[sorted[j].teamID]
	})

	var groups []teamGroup
	current := []*teamStats{sorted[0]}
	for k := 1; k < len(sorted); k++ {
		if priorityMap[sorted[k-1].teamID] == priorityMap[sorted[k].teamID] {
			current = append(current, sorted[k])
		} else {
			groups = append(groups, teamGroup{teams: current})
			current = []*teamStats{sorted[k]}
		}
	}
	groups = append(groups, teamGroup{teams: current})

	return groups
}

func applyImplicitAdminDecision(groups []teamGroup, priorities []*db_model.TiebreakPriority) []teamGroup {
	var result []teamGroup
	for _, g := range groups {
		if len(g.teams) <= 1 {
			result = append(result, g)
			continue
		}
		split := splitByTiebreakPriority(g.teams, priorities)
		result = append(result, split...)
	}
	return result
}

func assignRanks(groups []teamGroup) []rankedStats {
	var result []rankedStats
	rank := 1
	for _, g := range groups {
		for _, t := range g.teams {
			result = append(result, rankedStats{
				teamStats: *t,
				rank:      rank,
			})
		}
		rank += len(g.teams)
	}
	return result
}

func buildEntriesByMatch(matchEntries []*db_model.MatchEntry) map[string][]*db_model.MatchEntry {
	m := make(map[string][]*db_model.MatchEntry)
	for _, e := range matchEntries {
		m[e.MatchID] = append(m[e.MatchID], e)
	}
	return m
}

func buildFinishedMatchIDs(matches []*db_model.Match) map[string]bool {
	m := make(map[string]bool)
	for _, match := range matches {
		if match.Status == "FINISHED" {
			m[match.ID] = true
		}
	}
	return m
}
