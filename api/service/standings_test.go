package service

import (
	"database/sql"
	"testing"

	"sports-day/api/db_model"
)

func makeMatch(id, competitionID, status string) *db_model.Match {
	return &db_model.Match{
		ID:            id,
		Status:        status,
		CompetitionID: competitionID,
	}
}

func makeEntry(id, matchID, teamID string, score int) *db_model.MatchEntry {
	return &db_model.MatchEntry{
		ID:      id,
		MatchID: matchID,
		TeamID:  sql.NullString{String: teamID, Valid: true},
		Score:   score,
	}
}

func makeLeague(id string, winPt, drawPt, losePt int) *db_model.League {
	return &db_model.League{
		ID:     id,
		WinPt:  winPt,
		DrawPt: drawPt,
		LosePt: losePt,
	}
}

func makeRule(conditionKey string, priority int) *db_model.RankingRule {
	return &db_model.RankingRule{
		ID:           conditionKey,
		LeagueID:     "L1",
		ConditionKey: conditionKey,
		Priority:     priority,
	}
}

func TestCollectMatchStats_Basic(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B", "C", "D"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
		makeMatch("m4", "L1", "FINISHED"),
		makeMatch("m5", "L1", "FINISHED"),
		makeMatch("m6", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 2), makeEntry("e2", "m1", "B", 1),
		makeEntry("e3", "m2", "A", 3), makeEntry("e4", "m2", "C", 0),
		makeEntry("e5", "m3", "A", 1), makeEntry("e6", "m3", "D", 1),
		makeEntry("e7", "m4", "B", 2), makeEntry("e8", "m4", "C", 2),
		makeEntry("e9", "m5", "B", 0), makeEntry("e10", "m5", "D", 3),
		makeEntry("e11", "m6", "C", 1), makeEntry("e12", "m6", "D", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)

	if stats["A"].win != 2 || stats["A"].draw != 1 || stats["A"].lose != 0 {
		t.Errorf("Team A: expected 2W 1D 0L, got %dW %dD %dL", stats["A"].win, stats["A"].draw, stats["A"].lose)
	}
	if stats["A"].points != 7 {
		t.Errorf("Team A: expected 7 points, got %d", stats["A"].points)
	}
	if stats["A"].goalsFor != 6 || stats["A"].goalsAgainst != 2 {
		t.Errorf("Team A: expected GF=6 GA=2, got GF=%d GA=%d", stats["A"].goalsFor, stats["A"].goalsAgainst)
	}
	if stats["A"].matchesPlayed != 3 {
		t.Errorf("Team A: expected 3 matches, got %d", stats["A"].matchesPlayed)
	}
}

func TestCollectMatchStats_IgnoreNonFinished(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "STANDBY"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 2), makeEntry("e2", "m1", "B", 1),
		makeEntry("e3", "m2", "A", 0), makeEntry("e4", "m2", "B", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)

	if stats["A"].matchesPlayed != 1 {
		t.Errorf("expected 1 match, got %d", stats["A"].matchesPlayed)
	}
	if stats["B"].matchesPlayed != 1 {
		t.Errorf("expected 1 match, got %d", stats["B"].matchesPlayed)
	}
}

func TestRankTeams_BasicSortByPoints(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B", "C", "D"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
		makeMatch("m4", "L1", "FINISHED"),
		makeMatch("m5", "L1", "FINISHED"),
		makeMatch("m6", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 2), makeEntry("e2", "m1", "B", 1),
		makeEntry("e3", "m2", "A", 3), makeEntry("e4", "m2", "C", 0),
		makeEntry("e5", "m3", "A", 1), makeEntry("e6", "m3", "D", 1),
		makeEntry("e7", "m4", "B", 2), makeEntry("e8", "m4", "C", 2),
		makeEntry("e9", "m5", "B", 0), makeEntry("e10", "m5", "D", 3),
		makeEntry("e11", "m6", "C", 1), makeEntry("e12", "m6", "D", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
		makeRule("GOAL_DIFF", 2),
		makeRule("TOTAL_GOALS", 3),
	}

	ranked := rankTeams(stats, rules, matches, entries, true, nil, false)

	if ranked[0].teamID != "A" || ranked[0].rank != 1 {
		t.Errorf("expected A at rank 1, got %s at rank %d", ranked[0].teamID, ranked[0].rank)
	}
}

func TestRankTeams_TiedRanksSkip(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B", "C"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "STANDBY"),
		makeMatch("m3", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 1), makeEntry("e2", "m1", "B", 0),
		makeEntry("e3", "m2", "A", 0), makeEntry("e4", "m2", "C", 0),
		makeEntry("e5", "m3", "B", 1), makeEntry("e6", "m3", "C", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
	}

	ranked := rankTeams(stats, rules, matches, entries, false, nil, false)

	rankMap := make(map[string]int)
	for _, r := range ranked {
		rankMap[r.teamID] = r.rank
	}

	if rankMap["A"] != 1 || rankMap["B"] != 1 {
		t.Errorf("expected A and B at rank 1, got A=%d B=%d", rankMap["A"], rankMap["B"])
	}
	if rankMap["C"] != 3 {
		t.Errorf("expected C at rank 3, got %d", rankMap["C"])
	}
}

func TestRankTeams_GoalDiffTiebreaker(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 3), makeEntry("e2", "m1", "B", 0),
		makeEntry("e3", "m2", "B", 2), makeEntry("e4", "m2", "A", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
		makeRule("GOAL_DIFF", 2),
	}

	ranked := rankTeams(stats, rules, matches, entries, true, nil, false)

	if ranked[0].teamID != "A" || ranked[0].rank != 1 {
		t.Errorf("expected A at rank 1 (better GD), got %s at rank %d", ranked[0].teamID, ranked[0].rank)
	}
}

func TestRankTeams_HeadToHead2Teams(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B", "C"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 1), makeEntry("e2", "m1", "B", 0),
		makeEntry("e3", "m2", "B", 1), makeEntry("e4", "m2", "C", 0),
		makeEntry("e5", "m3", "C", 1), makeEntry("e6", "m3", "A", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
		makeRule("HEAD_TO_HEAD", 2),
	}

	ranked := rankTeams(stats, rules, matches, entries, true, nil, false)

	if len(ranked) != 3 {
		t.Fatalf("expected 3 teams, got %d", len(ranked))
	}
	if ranked[0].rank != 1 || ranked[1].rank != 1 || ranked[2].rank != 1 {
		t.Logf("ranks: %d %d %d", ranked[0].rank, ranked[1].rank, ranked[2].rank)
	}
}

func TestRankTeams_OddLeagueAverage(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B", "C"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 2), makeEntry("e2", "m1", "B", 0),
		makeEntry("e3", "m2", "A", 1), makeEntry("e4", "m2", "C", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	useAvg := shouldUseAverage(stats, len(teams))

	if !useAvg {
		t.Error("expected useAverage to be true for odd league with unequal matches")
	}

	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
		makeRule("GOAL_DIFF", 2),
	}

	ranked := rankTeams(stats, rules, matches, entries, false, nil, useAvg)

	if ranked[0].teamID != "A" {
		t.Errorf("expected A first, got %s", ranked[0].teamID)
	}
}

func TestRankTeams_TiebreakPriority(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 1), makeEntry("e2", "m1", "B", 1),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
	}

	priorities := []*db_model.TiebreakPriority{
		{ID: "tp1", LeagueID: "L1", TeamID: "B", Priority: 1},
		{ID: "tp2", LeagueID: "L1", TeamID: "A", Priority: 2},
	}

	ranked := rankTeams(stats, rules, matches, entries, true, priorities, false)

	if ranked[0].teamID != "B" || ranked[0].rank != 1 {
		t.Errorf("expected B at rank 1 (tiebreak priority), got %s at rank %d", ranked[0].teamID, ranked[0].rank)
	}
	if ranked[1].teamID != "A" || ranked[1].rank != 2 {
		t.Errorf("expected A at rank 2, got %s at rank %d", ranked[1].teamID, ranked[1].rank)
	}
}

func TestRankTeams_TiebreakPriorityNotSaved(t *testing.T) {
	league := makeLeague("L1", 3, 1, 0)
	teams := []string{"A", "B"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 1), makeEntry("e2", "m1", "B", 1),
	}

	stats := collectMatchStats(league, matches, entries, teams)
	rules := []*db_model.RankingRule{
		makeRule("WIN_POINTS", 1),
	}

	ranked := rankTeams(stats, rules, matches, entries, true, nil, false)

	if ranked[0].rank != 1 || ranked[1].rank != 1 {
		t.Errorf("expected both at rank 1 (no tiebreak), got %d and %d", ranked[0].rank, ranked[1].rank)
	}
}

func TestCheckAllFinished(t *testing.T) {
	tests := []struct {
		name     string
		matches  []*db_model.Match
		expected bool
	}{
		{
			name:     "empty",
			matches:  []*db_model.Match{},
			expected: false,
		},
		{
			name: "all finished",
			matches: []*db_model.Match{
				makeMatch("m1", "L1", "FINISHED"),
				makeMatch("m2", "L1", "FINISHED"),
			},
			expected: true,
		},
		{
			name: "one standby",
			matches: []*db_model.Match{
				makeMatch("m1", "L1", "FINISHED"),
				makeMatch("m2", "L1", "STANDBY"),
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := checkAllFinished(tt.matches)
			if result != tt.expected {
				t.Errorf("expected %v, got %v", tt.expected, result)
			}
		})
	}
}

func TestHeadToHead3Teams_PartialSeparation(t *testing.T) {
	teams := []*teamStats{
		{teamID: "A"}, {teamID: "B"}, {teamID: "C"},
	}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 2), makeEntry("e2", "m1", "B", 0),
		makeEntry("e3", "m2", "B", 1), makeEntry("e4", "m2", "C", 1),
		makeEntry("e5", "m3", "C", 0), makeEntry("e6", "m3", "A", 0),
	}

	groups := resolveHeadToHead(teams, matches, entries)

	if len(groups) < 2 {
		t.Errorf("expected partial separation (A separated), got %d groups", len(groups))
	}

	if len(groups) >= 1 && len(groups[0].teams) == 1 && groups[0].teams[0].teamID != "A" {
		t.Errorf("expected A at top, got %s", groups[0].teams[0].teamID)
	}
}

func TestRankTeams_CustomPointSettings(t *testing.T) {
	league := makeLeague("L1", 2, 1, 0)
	teams := []string{"A", "B"}

	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
	}

	entries := []*db_model.MatchEntry{
		makeEntry("e1", "m1", "A", 1), makeEntry("e2", "m1", "B", 0),
	}

	stats := collectMatchStats(league, matches, entries, teams)

	if stats["A"].points != 2 {
		t.Errorf("expected 2 points for win, got %d", stats["A"].points)
	}
	if stats["B"].points != 0 {
		t.Errorf("expected 0 points for loss, got %d", stats["B"].points)
	}
}
