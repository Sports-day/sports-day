package service

import (
	"context"
	"database/sql"
	"math"
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
	sportsRepository      repository.Sports
}

func NewLeague(db *gorm.DB, leagueRepository repository.League, matchRepository repository.Match, competitionRepository repository.Competition, competitionService *Competition, sportsRepository repository.Sports) League {
	return League{
		db:                    db,
		leagueRepository:      leagueRepository,
		matchRepository:       matchRepository,
		competitionRepository: competitionRepository,
		competitionService:    competitionService,
		sportsRepository:      sportsRepository,
	}
}

// SetCompetitionService は循環依存を避けるためにセッター注入する。
// NewLeague で渡された competitionService を上書きする（循環依存回避のため後から注入）。
func (s *League) SetCompetitionService(cs *Competition) {
	s.competitionService = cs
}

func (s *League) Create(ctx context.Context, input *model.CreateLeagueInput) (*db_model.League, error) {
	var league *db_model.League

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 1. 大会を作成
		competitionID := ulid.Make()

		competition := &db_model.Competition{
			ID:      competitionID,
			Name:    input.Name,
			Type:    string(model.CompetitionTypeLeague),
			SceneID: input.SceneID,
			SportID: sql.NullString{Valid: true, String: input.SportID},
		}

		if _, err := s.competitionRepository.Save(ctx, tx, competition); err != nil {
			return errors.Wrap(err)
		}

		// 2. リーグを作成
		league = &db_model.League{
			ID: competitionID,
		}

		if _, err := s.leagueRepository.Save(ctx, tx, league); err != nil {
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
	// 1. 削除前にリーグ情報を取得（削除後に返すため）
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 2. CompetitionServiceを使って大会を削除
	// ON DELETE CASCADEにより、leagues等が自動削除される
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

// indexEntriesByMatchID は試合エントリーを試合IDで索引化するヘルパー関数
func indexEntriesByMatchID(entries []*db_model.MatchEntry) map[string][]*db_model.MatchEntry {
	indexed := make(map[string][]*db_model.MatchEntry)
	for _, entry := range entries {
		indexed[entry.MatchID] = append(indexed[entry.MatchID], entry)
	}
	return indexed
}

func (s *League) GenerateRoundRobin(ctx context.Context, competitionID string, input *model.GenerateRoundRobinInput) ([]*db_model.Match, error) {
	var createdMatches []*db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// ① 参加チーム取得
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

		// 開始時刻をパース
		startTime, err := time.Parse(time.RFC3339, input.StartTime)
		if err != nil {
			return errors.Wrap(err)
		}

		// 場所IDの処理
		var locationID sql.NullString
		if input.LocationID != nil {
			locationID = sql.NullString{Valid: true, String: *input.LocationID}
		} else {
			locationID = sql.NullString{Valid: false}
		}

		// ② 最適化されたラウンドロビンスケジュールを生成
		schedule := s.generateOptimizedRoundRobinSchedule(teamIDs)

		// ③ スケジュールに基づいてマッチを生成
		for matchIndex, matchup := range schedule {
			// 各試合の開始時刻を計算
			matchTime := startTime.Add(time.Duration(matchIndex) * (time.Duration(input.MatchDuration+input.BreakDuration) * time.Minute))

			m := &db_model.Match{
				ID:            ulid.Make(),
				Time:          matchTime,
				Status:        string(model.MatchStatusStandby),
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

// generateOptimizedRoundRobinSchedule は最適化されたラウンドロビンスケジュールを生成します
func (s *League) generateOptimizedRoundRobinSchedule(teamIDs []string) [][2]string {
	n := len(teamIDs)
	if n < 2 {
		return nil
	}

	// チーム数が偶数の場合は標準的なラウンドロビンアルゴリズムを使用
	if n%2 == 0 {
		return s.generateEvenRoundRobin(teamIDs)
	} else {
		// チーム数が奇数の場合はダミーチームを追加して偶数にする
		return s.generateOddRoundRobin(teamIDs)
	}
}

// generateEvenRoundRobin は偶数チーム用の最適化されたスケジュールを生成
func (s *League) generateEvenRoundRobin(teamIDs []string) [][2]string {
	n := len(teamIDs)
	var schedule [][2]string

	// 標準的なラウンドロビンアルゴリズム（回転法）
	teams := make([]string, n)
	copy(teams, teamIDs)

	for round := 0; round < n-1; round++ {
		// 各ラウンドでの対戦を生成
		for i := 0; i < n/2; i++ {
			team1 := teams[i]
			team2 := teams[n-1-i]
			schedule = append(schedule, [2]string{team1, team2})
		}

		// 最初のチーム以外を回転（時計回り）
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

// generateOddRoundRobin は奇数チーム用の最適化されたスケジュールを生成
func (s *League) generateOddRoundRobin(teamIDs []string) [][2]string {
	n := len(teamIDs)
	var schedule [][2]string

	// 奇数の場合、各ラウンドで1チームが休み
	teams := make([]string, n)
	copy(teams, teamIDs)

	for round := 0; round < n; round++ {
		// 各ラウンドでの対戦を生成（1チームは休み）
		for i := 0; i < n/2; i++ {
			team1Idx := (round + i) % n
			team2Idx := (round + n - 1 - i) % n

			// 同じチーム同士の対戦を避ける
			if team1Idx != team2Idx {
				schedule = append(schedule, [2]string{teams[team1Idx], teams[team2Idx]})
			}
		}
	}

	return schedule
}

func (s *League) SetTiebreakPriorities(ctx context.Context, leagueID string, priorities []model.TiebreakPriorityInput) ([]*db_model.TiebreakPriority, error) {
	// リーグ存在確認
	if _, err := s.leagueRepository.Get(ctx, s.db, leagueID); err != nil {
		return nil, errors.Wrap(err)
	}

	dbPriorities := make([]*db_model.TiebreakPriority, len(priorities))
	for i, p := range priorities {
		dbPriorities[i] = &db_model.TiebreakPriority{
			LeagueID: leagueID,
			TeamID:   p.TeamID,
			Priority: int(p.Priority),
		}
	}

	var result []*db_model.TiebreakPriority
	err := s.db.Transaction(func(tx *gorm.DB) error {
		var txErr error
		result, txErr = s.leagueRepository.SetTiebreakPriorities(ctx, tx, leagueID, dbPriorities)
		if txErr != nil {
			return txErr
		}

		// 副作用: タイブレーク優先度の入力後に進出処理をトリガー
		if s.competitionService != nil {
			allComplete, err := s.competitionService.IsAllMatchesComplete(ctx, tx, leagueID)
			if err != nil {
				return err
			}
			if allComplete {
				if err := s.competitionService.TryPromote(ctx, tx, leagueID); err != nil {
					return err
				}
			}
		}

		return nil
	})
	if err != nil {
		return nil, errors.ErrSaveTiebreakPriority
	}
	return result, nil
}

func (s *League) GetTiebreakPriorities(ctx context.Context, leagueID string) ([]*db_model.TiebreakPriority, error) {
	return s.leagueRepository.ListTiebreakPriorities(ctx, s.db, leagueID)
}

func (s *League) ComputeStandings(ctx context.Context, leagueID string) ([]*model.Standing, error) {
	// leagueID は competitionID と同一（League は Competition の子エンティティ）
	competitionID := leagueID

	// 1. リーグとコンペティションを取得
	league, err := s.leagueRepository.Get(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	comp, err := s.competitionRepository.Get(ctx, s.db, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 2. ranking_rules を取得（sport_id 経由）
	var rankingRules []*db_model.RankingRule
	if comp.SportID.Valid {
		rankingRules, err = s.sportsRepository.ListRankingRules(ctx, s.db, comp.SportID.String)
		if err != nil {
			return nil, errors.Wrap(err)
		}
	}

	// 3. 参加チーム取得
	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, s.db, []string{competitionID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 4. 全試合取得
	allMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, s.db, []string{competitionID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 5. FINISHED 試合をフィルタ
	var finishedMatches []*db_model.Match
	var matchIDs []string
	allMatchesComplete := true
	for _, match := range allMatches {
		if match.Status == string(model.MatchStatusFinished) {
			finishedMatches = append(finishedMatches, match)
			matchIDs = append(matchIDs, match.ID)
		} else if match.Status != string(model.MatchStatusCanceled) {
			allMatchesComplete = false
		}
	}
	if len(allMatches) == 0 {
		allMatchesComplete = false
	}

	// 6. 試合エントリー取得
	var entriesByMatch map[string][]*db_model.MatchEntry
	if len(matchIDs) > 0 {
		matchEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, matchIDs)
		if err != nil {
			return nil, errors.Wrap(err)
		}
		entriesByMatch = indexEntriesByMatchID(matchEntries)
	} else {
		entriesByMatch = make(map[string][]*db_model.MatchEntry)
	}

	// 7. tiebreak_priorities 取得
	tiebreakPriorities, err := s.leagueRepository.ListTiebreakPriorities(ctx, s.db, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 8. 純粋関数で順位計算
	return computeNewStandings(
		leagueID,
		finishedMatches,
		entriesByMatch,
		competitionEntries,
		league,
		rankingRules,
		tiebreakPriorities,
		allMatchesComplete,
	), nil
}

// teamStats は順位計算用の内部データ構造
type teamStats struct {
	TeamID        string
	Win           int
	Draw          int
	Lose          int
	GoalsFor      int
	GoalsAgainst  int
	Points        int
	MatchesPlayed int
	_rank         int
}

func (s *teamStats) rank() int {
	return s._rank
}

// computeNewStandings は試合結果から順位表を都度計算する純粋関数
func computeNewStandings(
	competitionID string,
	finishedMatches []*db_model.Match,
	entriesByMatch map[string][]*db_model.MatchEntry,
	competitionEntries []*db_model.CompetitionEntry,
	league *db_model.League,
	rankingRules []*db_model.RankingRule,
	tiebreakPriorities []*db_model.TiebreakPriority,
	allMatchesComplete bool,
) []*model.Standing {
	// 1. 各チームの成績を集計
	statsMap := make(map[string]*teamStats)
	for _, entry := range competitionEntries {
		statsMap[entry.TeamID] = &teamStats{TeamID: entry.TeamID}
	}

	for _, match := range finishedMatches {
		entries := entriesByMatch[match.ID]
		if len(entries) != 2 {
			continue
		}

		t1, t2 := entries[0], entries[1]
		if !t1.TeamID.Valid || !t2.TeamID.Valid {
			continue
		}

		s1, ok1 := statsMap[t1.TeamID.String]
		s2, ok2 := statsMap[t2.TeamID.String]
		// 両方が参加チームでなければ BYE → スキップ
		if !ok1 || !ok2 {
			continue
		}

		s1.GoalsFor += t1.Score
		s1.GoalsAgainst += t2.Score
		s2.GoalsFor += t2.Score
		s2.GoalsAgainst += t1.Score
		s1.MatchesPlayed++
		s2.MatchesPlayed++

		if t1.Score > t2.Score {
			s1.Win++
			s1.Points += league.WinPt
			s2.Lose++
			s2.Points += league.LosePt
		} else if t1.Score < t2.Score {
			s2.Win++
			s2.Points += league.WinPt
			s1.Lose++
			s1.Points += league.LosePt
		} else {
			s1.Draw++
			s1.Points += league.DrawPt
			s2.Draw++
			s2.Points += league.DrawPt
		}
	}

	allStats := make([]*teamStats, 0, len(statsMap))
	for _, s := range statsMap {
		allStats = append(allStats, s)
	}

	// 2. ranking_rules を priority 順にソート
	sortedRules := make([]*db_model.RankingRule, len(rankingRules))
	copy(sortedRules, rankingRules)
	sort.Slice(sortedRules, func(i, j int) bool {
		return sortedRules[i].Priority < sortedRules[j].Priority
	})

	// デフォルトルール（ranking_rules 未設定の場合）
	if len(sortedRules) == 0 {
		sortedRules = []*db_model.RankingRule{
			{ConditionKey: "WIN_POINTS", Priority: 1},
			{ConditionKey: "GOAL_DIFF", Priority: 2},
			{ConditionKey: "TOTAL_GOALS", Priority: 3},
		}
	}

	// ADMIN_DECISION を暗黙の最終条件として追加（未登録の場合）
	hasAdminDecision := false
	for _, r := range sortedRules {
		if r.ConditionKey == "ADMIN_DECISION" {
			hasAdminDecision = true
			break
		}
	}
	if !hasAdminDecision {
		sortedRules = append(sortedRules, &db_model.RankingRule{
			ConditionKey: "ADMIN_DECISION",
			Priority:     sortedRules[len(sortedRules)-1].Priority + 1,
		})
	}

	// 3. 平均化が必要か判定
	useAverage := needsAveraging(allStats)

	// 4. 再帰的にグループソート＋順位付与
	rctx := &rankingContext{
		finishedMatches:    finishedMatches,
		entriesByMatch:     entriesByMatch,
		league:             league,
		tiebreakPriorities: tiebreakPriorities,
		allMatchesComplete: allMatchesComplete,
		useAverage:         useAverage,
	}
	assignRanksRecursive(allStats, sortedRules, 0, rctx, 1)

	// 5. TeamID 順で安定化してから rank 順にソート
	sort.SliceStable(allStats, func(i, j int) bool {
		return allStats[i].TeamID < allStats[j].TeamID
	})
	sort.SliceStable(allStats, func(i, j int) bool {
		return allStats[i].rank() < allStats[j].rank()
	})

	// 6. model.Standing に変換
	standings := make([]*model.Standing, len(allStats))
	for i, s := range allStats {
		standings[i] = &model.Standing{
			ID:            competitionID,
			TeamID:        s.TeamID,
			Win:           int32(s.Win),
			Draw:          int32(s.Draw),
			Lose:          int32(s.Lose),
			GoalsFor:      int32(s.GoalsFor),
			GoalsAgainst:  int32(s.GoalsAgainst),
			GoalDiff:      int32(s.GoalsFor - s.GoalsAgainst),
			Points:        int32(s.Points),
			Rank:          int32(s._rank),
			MatchesPlayed: int32(s.MatchesPlayed),
		}
	}
	return standings
}

// rankingContext は再帰処理に必要なコンテキスト
type rankingContext struct {
	finishedMatches    []*db_model.Match
	entriesByMatch     map[string][]*db_model.MatchEntry
	league             *db_model.League
	tiebreakPriorities []*db_model.TiebreakPriority
	allMatchesComplete bool
	useAverage         bool
}

// needsAveraging は全チームの消化試合数が同一かを判定
func needsAveraging(stats []*teamStats) bool {
	if len(stats) <= 1 {
		return false
	}
	first := stats[0].MatchesPlayed
	for _, s := range stats[1:] {
		if s.MatchesPlayed != first {
			return true
		}
	}
	return false
}

// getValue は条件キーに応じたチームの値を返す（平均化対応）
func getValue(s *teamStats, conditionKey string, useAverage bool) float64 {
	if s.MatchesPlayed == 0 {
		return 0
	}
	var raw float64
	switch conditionKey {
	case "WIN_POINTS":
		raw = float64(s.Points)
	case "GOAL_DIFF":
		raw = float64(s.GoalsFor - s.GoalsAgainst)
	case "TOTAL_GOALS":
		raw = float64(s.GoalsFor)
	default:
		return 0
	}
	if useAverage {
		return raw / float64(s.MatchesPlayed)
	}
	return raw
}

// splitByValue はグループを条件値でサブグループに分離する（降順）
func splitByValue(group []*teamStats, conditionKey string, useAverage bool) [][]*teamStats {
	if len(group) <= 1 {
		return [][]*teamStats{group}
	}

	// 降順ソート
	sort.SliceStable(group, func(i, j int) bool {
		return getValue(group[i], conditionKey, useAverage) > getValue(group[j], conditionKey, useAverage)
	})

	// 同値でグルーピング（浮動小数点誤差を考慮した epsilon 比較）
	const epsilon = 1e-9
	var subgroups [][]*teamStats
	current := []*teamStats{group[0]}
	for i := 1; i < len(group); i++ {
		if math.Abs(getValue(group[i], conditionKey, useAverage)-getValue(group[i-1], conditionKey, useAverage)) < epsilon {
			current = append(current, group[i])
		} else {
			subgroups = append(subgroups, current)
			current = []*teamStats{group[i]}
		}
	}
	subgroups = append(subgroups, current)
	return subgroups
}

// resolveHeadToHead は当該対戦結果で順位を分離する
func resolveHeadToHead(group []*teamStats, ctx *rankingContext) [][]*teamStats {
	if len(group) <= 1 {
		return [][]*teamStats{group}
	}

	teamSet := make(map[string]bool)
	for _, s := range group {
		teamSet[s.TeamID] = true
	}

	if len(group) == 2 {
		return resolveHeadToHead2(group, teamSet, ctx)
	}
	return resolveHeadToHeadMulti(group, teamSet, ctx)
}

// resolveHeadToHead2 は2チーム間の直接対決を判定
func resolveHeadToHead2(group []*teamStats, teamSet map[string]bool, ctx *rankingContext) [][]*teamStats {
	t1, t2 := group[0].TeamID, group[1].TeamID
	var t1Points, t2Points int

	for _, match := range ctx.finishedMatches {
		entries := ctx.entriesByMatch[match.ID]
		if len(entries) != 2 {
			continue
		}
		if !entries[0].TeamID.Valid || !entries[1].TeamID.Valid {
			continue
		}
		a, b := entries[0].TeamID.String, entries[1].TeamID.String

		isH2H := (a == t1 && b == t2) || (a == t2 && b == t1)
		if !isH2H {
			continue
		}

		s0, s1 := entries[0].Score, entries[1].Score
		if a == t1 {
			if s0 > s1 {
				t1Points += ctx.league.WinPt
				t2Points += ctx.league.LosePt
			} else if s0 < s1 {
				t1Points += ctx.league.LosePt
				t2Points += ctx.league.WinPt
			} else {
				t1Points += ctx.league.DrawPt
				t2Points += ctx.league.DrawPt
			}
		} else {
			if s0 > s1 {
				t2Points += ctx.league.WinPt
				t1Points += ctx.league.LosePt
			} else if s0 < s1 {
				t2Points += ctx.league.LosePt
				t1Points += ctx.league.WinPt
			} else {
				t2Points += ctx.league.DrawPt
				t1Points += ctx.league.DrawPt
			}
		}
	}

	if t1Points > t2Points {
		return [][]*teamStats{{group[0]}, {group[1]}}
	} else if t2Points > t1Points {
		return [][]*teamStats{{group[1]}, {group[0]}}
	}
	// 分離不可
	return [][]*teamStats{group}
}

// resolveHeadToHeadMulti は3チーム以上の当該対戦結果を判定
func resolveHeadToHeadMulti(group []*teamStats, teamSet map[string]bool, ctx *rankingContext) [][]*teamStats {
	// ミニリーグ: 当該チーム間の試合のみで勝ち点を再集計
	miniPoints := make(map[string]int)
	for _, s := range group {
		miniPoints[s.TeamID] = 0
	}

	for _, match := range ctx.finishedMatches {
		entries := ctx.entriesByMatch[match.ID]
		if len(entries) != 2 {
			continue
		}
		if !entries[0].TeamID.Valid || !entries[1].TeamID.Valid {
			continue
		}
		a, b := entries[0].TeamID.String, entries[1].TeamID.String
		if !teamSet[a] || !teamSet[b] {
			continue
		}

		s0, s1 := entries[0].Score, entries[1].Score
		if s0 > s1 {
			miniPoints[a] += ctx.league.WinPt
			miniPoints[b] += ctx.league.LosePt
		} else if s0 < s1 {
			miniPoints[b] += ctx.league.WinPt
			miniPoints[a] += ctx.league.LosePt
		} else {
			miniPoints[a] += ctx.league.DrawPt
			miniPoints[b] += ctx.league.DrawPt
		}
	}

	// ミニリーグの勝ち点で降順ソート
	sort.SliceStable(group, func(i, j int) bool {
		return miniPoints[group[i].TeamID] > miniPoints[group[j].TeamID]
	})

	// 同勝ち点でグルーピング（部分分離対応）
	var subgroups [][]*teamStats
	current := []*teamStats{group[0]}
	for i := 1; i < len(group); i++ {
		if miniPoints[group[i].TeamID] == miniPoints[group[i-1].TeamID] {
			current = append(current, group[i])
		} else {
			subgroups = append(subgroups, current)
			current = []*teamStats{group[i]}
		}
	}
	subgroups = append(subgroups, current)
	return subgroups
}

// resolveAdminDecision は管理者裁定でグループを分離する
func resolveAdminDecision(group []*teamStats, ctx *rankingContext) [][]*teamStats {
	if len(group) <= 1 {
		return [][]*teamStats{group}
	}
	if !ctx.allMatchesComplete {
		return [][]*teamStats{group}
	}

	// tiebreak_priorities から該当チームの優先度を取得
	priorityMap := make(map[string]int)
	for _, tp := range ctx.tiebreakPriorities {
		priorityMap[tp.TeamID] = tp.Priority
	}

	// グループ内のチームに優先度が設定されているか確認
	hasPriority := false
	for _, s := range group {
		if _, ok := priorityMap[s.TeamID]; ok {
			hasPriority = true
			break
		}
	}
	if !hasPriority {
		return [][]*teamStats{group}
	}

	// 優先度でソート（未設定は MaxInt で後方へ）
	const maxPriority = 1<<31 - 1
	sort.SliceStable(group, func(i, j int) bool {
		pi, oki := priorityMap[group[i].TeamID]
		pj, okj := priorityMap[group[j].TeamID]
		if !oki {
			pi = maxPriority
		}
		if !okj {
			pj = maxPriority
		}
		return pi < pj
	})

	// 同優先度でグルーピング
	var subgroups [][]*teamStats
	current := []*teamStats{group[0]}
	getPriority := func(s *teamStats) int {
		if p, ok := priorityMap[s.TeamID]; ok {
			return p
		}
		return maxPriority
	}
	for i := 1; i < len(group); i++ {
		if getPriority(group[i]) == getPriority(group[i-1]) {
			current = append(current, group[i])
		} else {
			subgroups = append(subgroups, current)
			current = []*teamStats{group[i]}
		}
	}
	subgroups = append(subgroups, current)
	return subgroups
}

// assignRanksRecursive はグループを再帰的に条件で分離して順位を付与する
func assignRanksRecursive(group []*teamStats, rules []*db_model.RankingRule, ruleIndex int, ctx *rankingContext, startRank int) {
	if len(group) <= 1 || ruleIndex >= len(rules) {
		for _, s := range group {
			s._rank = startRank
		}
		return
	}

	rule := rules[ruleIndex]
	var subgroups [][]*teamStats

	switch rule.ConditionKey {
	case "HEAD_TO_HEAD":
		subgroups = resolveHeadToHead(group, ctx)
	case "ADMIN_DECISION":
		subgroups = resolveAdminDecision(group, ctx)
	default:
		subgroups = splitByValue(group, rule.ConditionKey, ctx.useAverage)
	}

	currentRank := startRank
	for _, sg := range subgroups {
		if len(sg) == 1 {
			sg[0]._rank = currentRank
		} else {
			assignRanksRecursive(sg, rules, ruleIndex+1, ctx, currentRank)
		}
		currentRank += len(sg)
	}
}
