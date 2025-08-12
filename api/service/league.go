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
		// 1. 大会を作成
		competitionID := ulid.Make()

		competition := &db_model.Competition{
			ID:   competitionID,
			Name: input.Name,
			Type: "LEAGUE",
		}

		if err := tx.Save(competition).Error; err != nil {
			return errors.Wrap(err)
		}

		// 2. リーグを作成
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
	// 1. 削除前にリーグ情報を取得（削除後に返すため）
	league, err := s.leagueRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 2. CompetitionServiceを使って大会を削除
	// ON DELETE CASCADEにより、leagues, league_standings等が自動削除される
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

	// バッチでまとめて取得
	rows, err := s.leagueRepository.BatchGetStandingsByCompetitionIDs(ctx, s.db, competitionIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 先にキーを初期化（0件の大会にも空スライスを入れる）
	for _, id := range competitionIDs {
		standingMap[id] = []*db_model.LeagueStanding{}
	}

	// グルーピング
	for _, r := range rows {
		standingMap[r.ID] = append(standingMap[r.ID], r)
	}

	return standingMap, nil
}

func (s *League) GetStandingsMapByTeamIDs(ctx context.Context, teamIDs []string) (map[string][]*db_model.LeagueStanding, error) {
	standingMap := make(map[string][]*db_model.LeagueStanding, len(teamIDs))

	// バッチでまとめて取得（指定チームの全大会分）
	rows, err := s.leagueRepository.BatchGetStandingsByTeamIDs(ctx, s.db, teamIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 先にキーを初期化（0件のチームにも空スライスを入れる）
	for _, tid := range teamIDs {
		standingMap[tid] = []*db_model.LeagueStanding{}
	}

	// グルーピング
	for _, r := range rows {
		standingMap[r.TeamID] = append(standingMap[r.TeamID], r)
	}

	return standingMap, nil
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

func (s *League) CalculateStandings(ctx context.Context, competitionID string) ([]*db_model.LeagueStanding, error) {
	var calculatedStandings []*db_model.LeagueStanding

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 1. リーグルールを取得
		league, err := s.leagueRepository.Get(ctx, tx, competitionID)
		if err != nil {
			return err
		}

		// 2. 参加チームを取得
		competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{competitionID})
		if err != nil {
			return err
		}

		// 3. 全試合を取得
		allMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{competitionID})
		if err != nil {
			return err
		}

		// 4. FINISHED試合のみをフィルタ
		var finishedMatches []*db_model.Match
		var matchIDs []string
		for _, match := range allMatches {
			if match.Status == "FINISHED" {
				finishedMatches = append(finishedMatches, match)
				matchIDs = append(matchIDs, match.ID)
			}
		}

		// 5. 試合エントリーを取得して索引化
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

		// 6. 純関数で順位表を計算（総計のみ）
		standings := computeStandingsFromMatches(finishedMatches, entriesByMatch, competitionEntries, league)

		// 7. ソートとランク付け
		sortStandings(standings, league.CalculationType)
		assignRanks(standings, league.CalculationType)

		// 8. 必要に応じてDBに保存（現在の実装では保存せず返却のみ）
		// 将来的にはここでUpsertすることも可能

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

// indexEntriesByMatchID は試合エントリーを試合IDで索引化するヘルパー関数
func indexEntriesByMatchID(entries []*db_model.MatchEntry) map[string][]*db_model.MatchEntry {
	indexed := make(map[string][]*db_model.MatchEntry)
	for _, entry := range entries {
		indexed[entry.MatchID] = append(indexed[entry.MatchID], entry)
	}
	return indexed
}

// computeStandingsFromMatches は純関数として試合結果から順位表を計算
// 入力: FINISHED試合のみ、試合エントリーのマップ、参加チーム、リーグルール
// 出力: 総計ベースの順位表（平均値は一切計算しない）
func computeStandingsFromMatches(
	finishedMatches []*db_model.Match,
	entriesByMatch map[string][]*db_model.MatchEntry,
	competitionEntries []*db_model.CompetitionEntry,
	league *db_model.League,
) []*db_model.LeagueStanding {
	// チームごとの統計を初期化
	teamStats := make(map[string]*db_model.LeagueStanding)
	for _, entry := range competitionEntries {
		teamStats[entry.TeamID] = &db_model.LeagueStanding{
			ID:           league.ID, // CompetitionID
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

	// 各FINISHED試合の結果を集計
	for _, match := range finishedMatches {
		entries := entriesByMatch[match.ID]

		// 2チームの対戦でない場合はスキップ
		if len(entries) != 2 {
			continue
		}

		team1Entry := entries[0]
		team2Entry := entries[1]

		// チームIDがnullの場合はスキップ
		if !team1Entry.TeamID.Valid || !team2Entry.TeamID.Valid {
			continue
		}

		stats1, ok1 := teamStats[team1Entry.TeamID.String]
		stats2, ok2 := teamStats[team2Entry.TeamID.String]

		// 参加チームでない場合はスキップ
		if !ok1 || !ok2 {
			continue
		}

		// 得失点を更新
		stats1.GoalsFor += team1Entry.Score
		stats1.GoalsAgainst += team2Entry.Score
		stats2.GoalsFor += team2Entry.Score
		stats2.GoalsAgainst += team1Entry.Score

		// 勝敗を判定してポイントを計算
		if team1Entry.Score > team2Entry.Score {
			// Team1の勝利
			stats1.Win++
			stats1.Points += league.WinPt
			stats2.Lose++
			stats2.Points += league.LosePt
		} else if team1Entry.Score < team2Entry.Score {
			// Team2の勝利
			stats1.Lose++
			stats1.Points += league.LosePt
			stats2.Win++
			stats2.Points += league.WinPt
		} else {
			// 引き分け
			stats1.Draw++
			stats1.Points += league.DrawPt
			stats2.Draw++
			stats2.Points += league.DrawPt
		}
	}

	// mapをsliceに変換
	var standings []*db_model.LeagueStanding
	for _, stats := range teamStats {
		standings = append(standings, stats)
	}

	return standings
}

// sortStandings は計算タイプに基づいて順位表をソート
// 主キー → タイブレーク → TeamIDの順で安定ソート
func sortStandings(standings []*db_model.LeagueStanding, calcType string) {
	// タイブレークルールの定義
	// 将来的に設定化可能な設計
	tiebreakers := getTiebreakers(calcType)

	sort.SliceStable(standings, func(i, j int) bool {
		a, b := standings[i], standings[j]

		// 主キーで比較
		primaryCmp := comparePrimaryKey(a, b, calcType)
		if primaryCmp != 0 {
			return primaryCmp > 0
		}

		// タイブレーカーで比較
		for _, tb := range tiebreakers {
			cmp := compareTiebreaker(a, b, tb)
			if cmp != 0 {
				return cmp > 0
			}
		}

		// 最終的にTeamIDで安定化（昇順）
		return a.TeamID < b.TeamID
	})
}

// getTiebreakers は計算タイプに応じたタイブレークルールを返す
func getTiebreakers(calcType string) []string {
	switch calcType {
	case "WIN_SCORE":
		return []string{"GOAL_DIFF", "GOALS_FOR"}
	case "DIFF_SCORE":
		return []string{"GOALS_FOR", "POINTS"}
	case "TOTAL_SCORE":
		return []string{"GOAL_DIFF", "POINTS"}
	default:
		// デフォルトはWIN_SCOREと同じ
		return []string{"GOAL_DIFF", "GOALS_FOR"}
	}
}

// comparePrimaryKey は主キーでの比較結果を返す
// 戻り値: 1 (a > b), -1 (a < b), 0 (a == b)
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

// compareTiebreaker はタイブレーカーでの比較結果を返す
func compareTiebreaker(a, b *db_model.LeagueStanding, tiebreaker string) int {
	switch tiebreaker {
	case "POINTS":
		return compareInt(a.Points, b.Points)
	case "GOAL_DIFF":
		// GDは使わず、都度 gf - ga
		return compareInt(a.GoalsFor-a.GoalsAgainst, b.GoalsFor-b.GoalsAgainst)
	case "GOALS_FOR":
		return compareInt(a.GoalsFor, b.GoalsFor)
	case "GOALS_AGAINST":
		// 失点は少ない方が上位なので逆順
		return compareInt(b.GoalsAgainst, a.GoalsAgainst)
	default:
		return 0
	}
}

// compareInt は整数の比較結果を返す
func compareInt(a, b int) int {
	if a > b {
		return 1
	} else if a < b {
		return -1
	}
	return 0
}

// assignRanks は順位を付与する
// 主キーとタイブレーカー全てが同じ場合のみ同順位とする
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

		// 主キーが異なる場合は異なる順位
		if comparePrimaryKey(prev, curr, calcType) != 0 {
			currentRank = i + 1
			curr.Rank = currentRank
			continue
		}

		// タイブレーカーを全てチェック
		isSameRank := true
		for _, tb := range tiebreakers {
			if compareTiebreaker(prev, curr, tb) != 0 {
				isSameRank = false
				break
			}
		}

		if isSameRank {
			// 同順位
			curr.Rank = currentRank
		} else {
			// 異なる順位（飛び番号）
			currentRank = i + 1
			curr.Rank = currentRank
		}
	}
}
