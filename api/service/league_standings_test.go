package service

import (
	"database/sql"
	"testing"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
)

// ヘルパー: テスト用の試合とエントリーを作成
func makeMatch(id, compID, status string) *db_model.Match {
	return &db_model.Match{ID: id, CompetitionID: compID, Status: status}
}

func makeEntry(matchID, teamID string, score int) *db_model.MatchEntry {
	return &db_model.MatchEntry{
		ID:      matchID + "-" + teamID,
		MatchID: matchID,
		TeamID:  sql.NullString{String: teamID, Valid: true},
		Score:   score,
	}
}

func makeCompEntry(compID, teamID string) *db_model.CompetitionEntry {
	return &db_model.CompetitionEntry{CompetitionID: compID, TeamID: teamID}
}

func defaultLeague() *db_model.League {
	return &db_model.League{ID: "L1", WinPt: 3, DrawPt: 1, LosePt: 0}
}

func buildEntriesByMatch(entries []*db_model.MatchEntry) map[string][]*db_model.MatchEntry {
	m := make(map[string][]*db_model.MatchEntry)
	for _, e := range entries {
		m[e.MatchID] = append(m[e.MatchID], e)
	}
	return m
}

func findStanding(standings []*model.Standing, teamID string) *model.Standing {
	for _, s := range standings {
		if s.TeamID == teamID {
			return s
		}
	}
	return nil
}

// Test: 勝ち/引き分け/負けの勝ち点計算
func TestComputeNewStandings_BasicPoints(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// A beats B (2-1), B beats C (3-0), A draws C (1-1)
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 2), makeEntry("m1", "B", 1),
		makeEntry("m2", "B", 3), makeEntry("m2", "C", 0),
		makeEntry("m3", "A", 1), makeEntry("m3", "C", 1),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, true)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	c := findStanding(standings, "C")

	if a == nil || b == nil || c == nil {
		t.Fatal("missing standings")
	}
	// A: 1W 1D 0L = 3+1 = 4pt, B: 1W 0D 1L = 3pt, C: 0W 1D 1L = 1pt
	if a.Points != 4 {
		t.Errorf("A points: got %d, want 4", a.Points)
	}
	if b.Points != 3 {
		t.Errorf("B points: got %d, want 3", b.Points)
	}
	if c.Points != 1 {
		t.Errorf("C points: got %d, want 1", c.Points)
	}
	// Ranks: A=1, B=2, C=3
	if a.Rank != 1 {
		t.Errorf("A rank: got %d, want 1", a.Rank)
	}
	if b.Rank != 2 {
		t.Errorf("B rank: got %d, want 2", b.Rank)
	}
	if c.Rank != 3 {
		t.Errorf("C rank: got %d, want 3", c.Rank)
	}
}

// Test: 同順位→次の順位が飛ぶ
func TestComputeNewStandings_TiedRanksSkip(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// A beats C, B beats C, A draws B → A=4pt, B=4pt, C=0pt
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 2), makeEntry("m1", "C", 0),
		makeEntry("m2", "B", 2), makeEntry("m2", "C", 0),
		makeEntry("m3", "A", 1), makeEntry("m3", "B", 1),
	}
	// Only WIN_POINTS rule → A and B tie
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, false)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	c := findStanding(standings, "C")

	// A and B both rank 1, C ranks 3 (skip 2)
	if a.Rank != 1 || b.Rank != 1 {
		t.Errorf("A rank=%d, B rank=%d, both should be 1", a.Rank, b.Rank)
	}
	if c.Rank != 3 {
		t.Errorf("C rank: got %d, want 3", c.Rank)
	}
}

// Test: 消化試合数差ありの平均化
func TestComputeNewStandings_Averaging(t *testing.T) {
	league := defaultLeague()
	entries3 := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// Only 2 of 3 matches finished: A-B and A-C. B-C not yet played.
	// A: 2 matches (2W = 6pt), B: 1 match (0W 1L = 0pt), C: 1 match (0W 1L = 0pt)
	// Average: A = 3.0, B = 0.0, C = 0.0
	matches3 := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
	}
	matchEntries3 := []*db_model.MatchEntry{
		makeEntry("m1", "A", 2), makeEntry("m1", "B", 0),
		makeEntry("m2", "A", 3), makeEntry("m2", "C", 1),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
		{SportID: "S1", ConditionKey: "GOAL_DIFF", Priority: 2},
	}

	standings := computeNewStandings("L1", matches3, buildEntriesByMatch(matchEntries3), entries3, league, rules, nil, false)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	c := findStanding(standings, "C")

	if a.Rank != 1 {
		t.Errorf("A rank: got %d, want 1", a.Rank)
	}
	// B and C both have 0 points, avg 0.0 → tied on WIN_POINTS
	// GOAL_DIFF: B = (0-2)/1 = -2.0, C = (1-3)/1 = -2.0 → tied
	if b.Rank != c.Rank {
		t.Errorf("B rank=%d, C rank=%d, should be equal", b.Rank, c.Rank)
	}
	if a.MatchesPlayed != 2 {
		t.Errorf("A matchesPlayed: got %d, want 2", a.MatchesPlayed)
	}
	if b.MatchesPlayed != 1 {
		t.Errorf("B matchesPlayed: got %d, want 1", b.MatchesPlayed)
	}
}

// Test: 消化試合数同一の場合は合計値使用
func TestComputeNewStandings_NoAveragingWhenEqual(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// All 3 matches finished: each team plays 2 matches
	// A beats B (2-1), B beats C (3-0), C beats A (2-1)
	// A: 1W 1L = 3pt, GD = (2+1)-(1+2) = 0
	// B: 1W 1L = 3pt, GD = (1+3)-(2+0) = 2
	// C: 1W 1L = 3pt, GD = (0+2)-(3+1) = -2
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 2), makeEntry("m1", "B", 1),
		makeEntry("m2", "B", 3), makeEntry("m2", "C", 0),
		makeEntry("m3", "C", 2), makeEntry("m3", "A", 1),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
		{SportID: "S1", ConditionKey: "GOAL_DIFF", Priority: 2},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, true)

	b := findStanding(standings, "B")
	a := findStanding(standings, "A")
	c := findStanding(standings, "C")

	// All same points (3), GOAL_DIFF: B=2, A=0, C=-2
	if b.Rank != 1 {
		t.Errorf("B rank: got %d, want 1", b.Rank)
	}
	if a.Rank != 2 {
		t.Errorf("A rank: got %d, want 2", a.Rank)
	}
	if c.Rank != 3 {
		t.Errorf("C rank: got %d, want 3", c.Rank)
	}
}

// Test: HEAD_TO_HEAD 2チーム（直接対決で分離）
func TestComputeNewStandings_HeadToHead2Teams(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// A beats C (1-0), B beats C (1-0), A loses to B (0-1)
	// A: 1W 1L = 3pt, B: 2W = 6pt, C: 2L = 0pt
	// With WIN_POINTS → B first, then A, then C. No H2H needed.
	// Make them tied: A beats C (3-0), B beats C (1-0), A draws B (0-0)
	// A: 1W 1D = 4pt, B: 1W 1D = 4pt, C: 2L = 0pt
	// H2H for A vs B: draw → can't separate
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 3), makeEntry("m1", "C", 0),
		makeEntry("m2", "B", 1), makeEntry("m2", "C", 0),
		makeEntry("m3", "A", 0), makeEntry("m3", "B", 0),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
		{SportID: "S1", ConditionKey: "HEAD_TO_HEAD", Priority: 2},
		{SportID: "S1", ConditionKey: "GOAL_DIFF", Priority: 3},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, true)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")

	// H2H draw → next condition GOAL_DIFF: A = 3-0 = 3, B = 1-0 = 1 → A wins
	if a.Rank != 1 {
		t.Errorf("A rank: got %d, want 1", a.Rank)
	}
	if b.Rank != 2 {
		t.Errorf("B rank: got %d, want 2", b.Rank)
	}
}

// Test: HEAD_TO_HEAD 3チーム以上 + 部分分離
func TestComputeNewStandings_HeadToHead3Teams(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	// All teams draw with each other: 3 draws
	// A-B: 1-1, B-C: 1-1, A-C: 1-1
	// All: 2D = 2pt each
	// H2H among 3: mini-league all 1pt each → can't separate
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
		makeMatch("m3", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 1), makeEntry("m1", "B", 1),
		makeEntry("m2", "B", 1), makeEntry("m2", "C", 1),
		makeEntry("m3", "A", 1), makeEntry("m3", "C", 1),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
		{SportID: "S1", ConditionKey: "HEAD_TO_HEAD", Priority: 2},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, true)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	c := findStanding(standings, "C")

	// All tied after H2H → ADMIN_DECISION (implicit) but no priorities → all rank 1
	if a.Rank != 1 || b.Rank != 1 || c.Rank != 1 {
		t.Errorf("Expected all rank 1, got A=%d B=%d C=%d", a.Rank, b.Rank, c.Rank)
	}
}

// Test: ADMIN_DECISION（保存済み / 未保存）
func TestComputeNewStandings_AdminDecision(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"),
	}
	// A draws B → both 1pt, tied
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 1), makeEntry("m1", "B", 1),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
	}

	// Without tiebreak → tied (allMatchesComplete=true but no priorities)
	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, true)
	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	if a.Rank != 1 || b.Rank != 1 {
		t.Errorf("Without tiebreak: A=%d B=%d, both should be 1", a.Rank, b.Rank)
	}

	// With tiebreak → A gets priority 1, B gets priority 2
	tiebreaks := []*db_model.TiebreakPriority{
		{LeagueID: "L1", TeamID: "A", Priority: 1},
		{LeagueID: "L1", TeamID: "B", Priority: 2},
	}
	standings2 := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, tiebreaks, true)
	a2 := findStanding(standings2, "A")
	b2 := findStanding(standings2, "B")
	if a2.Rank != 1 {
		t.Errorf("With tiebreak: A rank=%d, want 1", a2.Rank)
	}
	if b2.Rank != 2 {
		t.Errorf("With tiebreak: B rank=%d, want 2", b2.Rank)
	}

	// allMatchesComplete=false → tiebreak not applied
	standings3 := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, tiebreaks, false)
	a3 := findStanding(standings3, "A")
	b3 := findStanding(standings3, "B")
	if a3.Rank != 1 || b3.Rank != 1 {
		t.Errorf("Incomplete matches: A=%d B=%d, both should be 1", a3.Rank, b3.Rank)
	}
}

// Test: BYE は消化試合数に含まれない
func TestComputeNewStandings_BYEExcluded(t *testing.T) {
	league := defaultLeague()
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"),
	}
	// Match with a team not in entries (BYE)
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"),
		makeMatch("m2", "L1", "FINISHED"),
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 2), makeEntry("m1", "B", 0), // normal match
		makeEntry("m2", "A", 3), // A vs non-entry team
		{ID: "m2-X", MatchID: "m2", TeamID: sql.NullString{String: "X", Valid: true}, Score: 0},
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, false)

	a := findStanding(standings, "A")
	// A should only count 1 match (m1), not m2 (BYE because X is not in entries)
	if a.MatchesPlayed != 1 {
		t.Errorf("A matchesPlayed: got %d, want 1 (BYE excluded)", a.MatchesPlayed)
	}
}

// Test: 順位表は DB に永続化されない（返り値が model.Standing）
func TestComputeNewStandings_ReturnsModelStanding(t *testing.T) {
	standings := computeNewStandings("L1", nil, nil,
		[]*db_model.CompetitionEntry{makeCompEntry("L1", "A")},
		defaultLeague(), nil, nil, false)

	if len(standings) != 1 {
		t.Fatalf("expected 1 standing, got %d", len(standings))
	}
	if standings[0].ID != "L1" || standings[0].TeamID != "A" {
		t.Errorf("unexpected standing: %+v", standings[0])
	}
}

// Test: 消化試合数が異なるが平均が同じ2チームが同順位になる（float epsilon 比較）
func TestComputeNewStandings_FloatEpsilonComparison(t *testing.T) {
	league := defaultLeague()
	// A: 2試合で6pt (平均3.0), B: 1試合で3pt (平均3.0), C: 3試合で0pt (平均0.0)
	entries := []*db_model.CompetitionEntry{
		makeCompEntry("L1", "A"), makeCompEntry("L1", "B"), makeCompEntry("L1", "C"),
	}
	matches := []*db_model.Match{
		makeMatch("m1", "L1", "FINISHED"), // A beats C
		makeMatch("m2", "L1", "FINISHED"), // A beats C
		makeMatch("m3", "L1", "FINISHED"), // B beats C
	}
	matchEntries := []*db_model.MatchEntry{
		makeEntry("m1", "A", 1), makeEntry("m1", "C", 0),
		makeEntry("m2", "A", 1), makeEntry("m2", "C", 0),
		makeEntry("m3", "B", 1), makeEntry("m3", "C", 0),
	}
	rules := []*db_model.RankingRule{
		{SportID: "S1", ConditionKey: "WIN_POINTS", Priority: 1},
	}

	standings := computeNewStandings("L1", matches, buildEntriesByMatch(matchEntries), entries, league, rules, nil, false)

	a := findStanding(standings, "A")
	b := findStanding(standings, "B")
	c := findStanding(standings, "C")

	if a == nil || b == nil || c == nil {
		t.Fatal("missing standings")
	}

	// A: 6pt / 2試合 = 3.0, B: 3pt / 1試合 = 3.0 → 同順位であるべき
	if a.Rank != b.Rank {
		t.Errorf("A rank=%d, B rank=%d, should be equal (both avg 3.0)", a.Rank, b.Rank)
	}
	if c.Rank <= a.Rank {
		t.Errorf("C rank=%d should be below A rank=%d", c.Rank, a.Rank)
	}
}
