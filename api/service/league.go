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
}

func NewLeague(db *gorm.DB, leagueRepository repository.League, matchRepository repository.Match, competitionRepository repository.Competition, competitionService *Competition) League {
	return League{
		db:                    db,
		leagueRepository:      leagueRepository,
		matchRepository:       matchRepository,
		competitionRepository: competitionRepository,
		competitionService:    competitionService,
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
			ID:              competitionID,
			CalculationType: string(input.CalculationType),
		}

		if err := tx.Save(league).Error; err != nil {
			return errors.Wrap(err)
		}

		return nil
	})

	if err != nil {
		return nil, errors.ErrSaveLeague
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

func (s *League) UpdateLeagueRule(ctx context.Context, id string, input *model.UpdateLeagueRuleInput) (*db_model.League, error) {
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.CalculationType != nil {
		league.CalculationType = string(*input.CalculationType)
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

func (s *League) CreateLeagueStanding(ctx context.Context, id string, teamId string) (*db_model.LeagueStanding, error) {
	standing := &db_model.LeagueStanding{
		ID:     id,
		TeamID: teamId,
	}

	savedStanding, err := s.leagueRepository.SaveStanding(ctx, s.db, standing)
	if err != nil {
		return nil, errors.ErrSaveLeagueStanding
	}
	return savedStanding, nil
}

func (s *League) GetStandingsMapByCompetitionIDs(ctx context.Context, competitionIDs []string) (map[string][]*db_model.LeagueStanding, error) {
	standingMap := make(map[string][]*db_model.LeagueStanding, len(competitionIDs))

	rows, err := s.leagueRepository.BatchGetStandingsByCompetitionIDs(ctx, s.db, competitionIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	for _, id := range competitionIDs {
		standingMap[id] = []*db_model.LeagueStanding{}
	}

	for _, r := range rows {
		standingMap[r.ID] = append(standingMap[r.ID], r)
	}

	return standingMap, nil
}

func (s *League) GetStandingsMapByTeamIDs(ctx context.Context, teamIDs []string) (map[string][]*db_model.LeagueStanding, error) {
	standingMap := make(map[string][]*db_model.LeagueStanding, len(teamIDs))

	rows, err := s.leagueRepository.BatchGetStandingsByTeamIDs(ctx, s.db, teamIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	for _, tid := range teamIDs {
		standingMap[tid] = []*db_model.LeagueStanding{}
	}

	for _, r := range rows {
		standingMap[r.TeamID] = append(standingMap[r.TeamID], r)
	}

	return standingMap, nil
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
	}
	return s.generateOddRoundRobin(teamIDs)
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

func (s *League) CalculateStandings(ctx context.Context, competitionID string) ([]*db_model.LeagueStanding, error) {
	var calculatedStandings []*db_model.LeagueStanding

	err := s.db.Transaction(func(tx *gorm.DB) error {
		league, err := s.leagueRepository.Get(ctx, tx, competitionID)
		if err != nil {
			return err
		}

		competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{competitionID})
		if err != nil {
			return err
		}

		allMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{competitionID})
		if err != nil {
			return err
		}

		var finishedMatches []*db_model.Match
		var matchIDs []string
		for _, match := range allMatches {
			if match.Status == "FINISHED" {
				finishedMatches = append(finishedMatches, match)
				matchIDs = append(matchIDs, match.ID)
			}
		}

		var entriesByMatch map[string][]*db_model.MatchEntry
		if len(matchIDs) > 0 {
			matchEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
			if err != nil {
				return err
			}
			entriesByMatch = indexEntriesByMatchID(matchEntries)
		} else {
			entriesByMatch = make(map[string][]*db_model.MatchEntry)
		}

		standings := computeStandingsFromMatches(finishedMatches, entriesByMatch, competitionEntries, league)

		sortStandings(standings, league.CalculationType)
		assignRanks(standings, league.CalculationType)

		for _, standing := range standings {
			_, err := s.leagueRepository.SaveStanding(ctx, tx, standing)
			if err != nil {
				return err
			}
		}

		rows, err := s.leagueRepository.ListStandings(ctx, tx, competitionID)
		if err != nil {
			return err
		}
		calculatedStandings = rows

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return calculatedStandings, nil
}

func indexEntriesByMatchID(entries []*db_model.MatchEntry) map[string][]*db_model.MatchEntry {
	indexed := make(map[string][]*db_model.MatchEntry)
	for _, entry := range entries {
		indexed[entry.MatchID] = append(indexed[entry.MatchID], entry)
	}
	return indexed
}

func computeStandingsFromMatches(
	finishedMatches []*db_model.Match,
	entriesByMatch map[string][]*db_model.MatchEntry,
	competitionEntries []*db_model.CompetitionEntry,
	league *db_model.League,
) []*db_model.LeagueStanding {
	teamStats := make(map[string]*db_model.LeagueStanding)
	for _, entry := range competitionEntries {
		teamStats[entry.TeamID] = &db_model.LeagueStanding{
			ID:           league.ID,
			TeamID:       entry.TeamID,
			Win:          0,
			Draw:         0,
			Lose:         0,
			GoalsFor:     0,
			GoalsAgainst: 0,
			Points:       0,
			Rank:         0,
		}
	}

	for _, match := range finishedMatches {
		entries := entriesByMatch[match.ID]

		if len(entries) != 2 {
			continue
		}

		team1Entry := entries[0]
		team2Entry := entries[1]

		if !team1Entry.TeamID.Valid || !team2Entry.TeamID.Valid {
			continue
		}

		stats1, ok1 := teamStats[team1Entry.TeamID.String]
		stats2, ok2 := teamStats[team2Entry.TeamID.String]

		if !ok1 || !ok2 {
			continue
		}

		stats1.GoalsFor += team1Entry.Score
		stats1.GoalsAgainst += team2Entry.Score
		stats2.GoalsFor += team2Entry.Score
		stats2.GoalsAgainst += team1Entry.Score

		if team1Entry.Score > team2Entry.Score {
			stats1.Win++
			stats1.Points += league.WinPt
			stats2.Lose++
			stats2.Points += league.LosePt
		} else if team1Entry.Score < team2Entry.Score {
			stats1.Lose++
			stats1.Points += league.LosePt
			stats2.Win++
			stats2.Points += league.WinPt
		} else {
			stats1.Draw++
			stats1.Points += league.DrawPt
			stats2.Draw++
			stats2.Points += league.DrawPt
		}
	}

	var standings []*db_model.LeagueStanding
	for _, stats := range teamStats {
		standings = append(standings, stats)
	}

	return standings
}

func sortStandings(standings []*db_model.LeagueStanding, calcType string) {
	tiebreakers := getTiebreakers(calcType)

	sort.SliceStable(standings, func(i, j int) bool {
		a, b := standings[i], standings[j]

		primaryCmp := comparePrimaryKey(a, b, calcType)
		if primaryCmp != 0 {
			return primaryCmp > 0
		}

		for _, tb := range tiebreakers {
			cmp := compareTiebreaker(a, b, tb)
			if cmp != 0 {
				return cmp > 0
			}
		}

		return a.TeamID < b.TeamID
	})
}

func getTiebreakers(calcType string) []string {
	switch calcType {
	case "WIN_SCORE":
		return []string{"GOAL_DIFF", "GOALS_FOR"}
	case "DIFF_SCORE":
		return []string{"GOALS_FOR", "POINTS"}
	case "TOTAL_SCORE":
		return []string{"GOAL_DIFF", "POINTS"}
	default:
		return []string{"GOAL_DIFF", "GOALS_FOR"}
	}
}

func comparePrimaryKey(a, b *db_model.LeagueStanding, calcType string) int {
	switch calcType {
	case "WIN_SCORE":
		return compareInt(a.Points, b.Points)
	case "DIFF_SCORE":
		return compareInt(a.GoalsFor-a.GoalsAgainst, b.GoalsFor-b.GoalsAgainst)
	case "TOTAL_SCORE":
		return compareInt(a.GoalsFor, b.GoalsFor)
	default:
		return compareInt(a.Points, b.Points)
	}
}

func compareTiebreaker(a, b *db_model.LeagueStanding, tiebreaker string) int {
	switch tiebreaker {
	case "POINTS":
		return compareInt(a.Points, b.Points)
	case "GOAL_DIFF":
		return compareInt(a.GoalsFor-a.GoalsAgainst, b.GoalsFor-b.GoalsAgainst)
	case "GOALS_FOR":
		return compareInt(a.GoalsFor, b.GoalsFor)
	case "GOALS_AGAINST":
		return compareInt(b.GoalsAgainst, a.GoalsAgainst)
	default:
		return 0
	}
}

func compareInt(a, b int) int {
	if a > b {
		return 1
	} else if a < b {
		return -1
	}
	return 0
}

func assignRanks(standings []*db_model.LeagueStanding, calcType string) {
	if len(standings) == 0 {
		return
	}

	tiebreakers := getTiebreakers(calcType)
	standings[0].Rank = 1
	currentRank := 1

	for i := 1; i < len(standings); i++ {
		prev := standings[i-1]
		curr := standings[i]

		if comparePrimaryKey(prev, curr, calcType) != 0 {
			currentRank = i + 1
			curr.Rank = currentRank
			continue
		}

		isSameRank := true
		for _, tb := range tiebreakers {
			if compareTiebreaker(prev, curr, tb) != 0 {
				isSameRank = false
				break
			}
		}

		if isSameRank {
			curr.Rank = currentRank
		} else {
			currentRank = i + 1
			curr.Rank = currentRank
		}
	}
}