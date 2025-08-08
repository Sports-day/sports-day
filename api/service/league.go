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
}

func NewLeague(db *gorm.DB, leagueRepository repository.League, matchRepository repository.Match, competitionRepository repository.Competition) League {
	return League{
		db:                    db,
		leagueRepository:      leagueRepository,
		matchRepository:       matchRepository,
		competitionRepository: competitionRepository,
	}
}

func (s *League) Create(ctx context.Context, input *model.CreateLeagueInput) (*db_model.League, error) {

	league := &db_model.League{
		ID:              input.CompetitionID,
		CalculationType: string(input.CalculationType),
	}

	league, err := s.leagueRepository.Save(ctx, s.db, league)
	if err != nil {
		return nil, errors.ErrSaveLeague
	}
	return league, nil

}

func (s *League) Delete(ctx context.Context, id string) (*db_model.League, error) {
	league, err := s.leagueRepository.Delete(ctx, s.db, id)
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
	standingMap := make(map[string][]*db_model.LeagueStanding)

	for _, competitionID := range competitionIDs {
		standings, err := s.calculateStandings(ctx, competitionID)
		if err != nil {
			return nil, errors.Wrap(err)
		}
		standingMap[competitionID] = standings
	}

	return standingMap, nil
}

func (s *League) GetStandingsMapByTeamIDs(ctx context.Context, teamIDs []string) (map[string][]*db_model.LeagueStanding, error) {
	standingMap := make(map[string][]*db_model.LeagueStanding)

	// 各チームが参加している大会を取得
	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByTeamIDs(ctx, s.db, teamIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// チームごとの大会リストを作成
	teamCompetitionsMap := make(map[string][]string)
	for _, entry := range competitionEntries {
		teamCompetitionsMap[entry.TeamID] = append(teamCompetitionsMap[entry.TeamID], entry.CompetitionID)
	}

	// 各チームの順位表を取得
	for _, teamID := range teamIDs {
		competitionIDs := teamCompetitionsMap[teamID]
		for _, competitionID := range competitionIDs {
			standings, err := s.calculateStandings(ctx, competitionID)
			if err != nil {
				return nil, errors.Wrap(err)
			}

			// 該当チームの順位表のみ抽出
			for _, standing := range standings {
				if standing.TeamID == teamID {
					standingMap[teamID] = append(standingMap[teamID], standing)
				}
			}
		}
	}

	return standingMap, nil
}

func (s *League) GenerateRoundRobin(ctx context.Context, competitionID string) ([]*db_model.Match, error) {
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

		competition, err := s.competitionRepository.Get(ctx, s.db, competitionID)
		if err != nil {
			return err
		}

		teamIDs := make([]string, len(entries))
		for i, e := range entries {
			teamIDs[i] = e.TeamID
		}

		// ② 総当たりでマッチ生成＋エントリー登録
		for i := 0; i < len(teamIDs)-1; i++ {
			for j := i + 1; j < len(teamIDs); j++ {
				// マッチ生成
				m := &db_model.Match{
					ID:            ulid.Make(),
					Time:          time.Now(),
					Status:        "STANBY",
					CompetitionID: competitionID,
					LocationID:    competition.DefaultLocationID.String,
				}
				saved, err := s.matchRepository.Save(ctx, tx, m)
				if err != nil {
					return err
				}

				if _, err := s.matchRepository.AddMatchEntries(
					ctx, tx,
					saved.ID,
					[]string{teamIDs[i], teamIDs[j]},
				); err != nil {
					return err
				}

				createdMatches = append(createdMatches, saved)
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return createdMatches, nil
}

// 既存の LeagueStanding 構造体を変更せずに実装

func (s *League) calculateStandings(ctx context.Context, competitionID string) ([]*db_model.LeagueStanding, error) {
	// リーグ情報を取得
	league, err := s.leagueRepository.Get(ctx, s.db, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 大会の参加チームを取得
	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, s.db, []string{competitionID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var entries []*db_model.CompetitionEntry
	for _, entry := range competitionEntries {
		if entry.CompetitionID == competitionID {
			entries = append(entries, entry)
		}
	}

	// 大会の試合を取得
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, s.db, []string{competitionID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var competitionMatches []*db_model.Match
	for _, match := range matches {
		if match.CompetitionID == competitionID {
			competitionMatches = append(competitionMatches, match)
		}
	}

	// 試合IDを収集
	var matchIDs []string
	for _, match := range competitionMatches {
		matchIDs = append(matchIDs, match.ID)
	}

	// 試合エントリーを取得
	matchEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, matchIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// リーグが完了しているかチェック（内部判定）
	isLeagueFinished := s.isLeagueFinished(competitionMatches)

	// チームごとの統計を初期化
	teamStats := make(map[string]*db_model.LeagueStanding)
	for _, entry := range entries {
		teamStats[entry.TeamID] = &db_model.LeagueStanding{
			ID:     competitionID,
			TeamID: entry.TeamID,
			Win:    0,
			Draw:   0,
			Lose:   0,
			Gf:     0,
			Ga:     0,
			Gd:     sql.NullInt64{Valid: true, Int64: 0},
			Points: 0,
			Rank:   0,
		}
	}

	// 各チームの総試合数を計算（予定試合数）
	teamTotalMatches := make(map[string]int)
	for _, match := range competitionMatches {
		var matchTeamEntries []*db_model.MatchEntry
		for _, entry := range matchEntries {
			if entry.MatchID == match.ID {
				matchTeamEntries = append(matchTeamEntries, entry)
			}
		}
		if len(matchTeamEntries) == 2 {
			teamTotalMatches[matchTeamEntries[0].TeamID]++
			teamTotalMatches[matchTeamEntries[1].TeamID]++
		}
	}

	// 試合結果を集計
	for _, match := range competitionMatches {
		if match.Status != "finished" {
			continue
		}

		var matchTeamEntries []*db_model.MatchEntry
		for _, entry := range matchEntries {
			if entry.MatchID == match.ID {
				matchTeamEntries = append(matchTeamEntries, entry)
			}
		}

		if len(matchTeamEntries) != 2 {
			continue
		}

		team1 := matchTeamEntries[0]
		team2 := matchTeamEntries[1]

		stats1 := teamStats[team1.TeamID]
		stats2 := teamStats[team2.TeamID]

		stats1.Gf += team1.Score
		stats1.Ga += team2.Score
		stats2.Gf += team2.Score
		stats2.Ga += team1.Score

		// 勝敗を判定
		if team1.Score > team2.Score {
			stats1.Win++
			stats1.Points += league.WinPt
			stats2.Lose++
			stats2.Points += league.LosePt
		} else if team1.Score < team2.Score {
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

		// 得失点差を更新
		stats1.Gd = sql.NullInt64{Valid: true, Int64: int64(stats1.Gf - stats1.Ga)}
		stats2.Gd = sql.NullInt64{Valid: true, Int64: int64(stats2.Gf - stats2.Ga)}
	}

	// リーグ進行中の場合のみ平均値で置き換え
	if !isLeagueFinished {
		for _, stats := range teamStats {
			totalMatches := teamTotalMatches[stats.TeamID]
			if totalMatches > 0 {
				// 既存のフィールドを平均値で置き換え
				avgPoints := float64(stats.Points) / float64(totalMatches)
				avgGf := float64(stats.Gf) / float64(totalMatches)
				avgGa := float64(stats.Ga) / float64(totalMatches)
				avgGd := avgGf - avgGa

				// 小数点を保持するために適切にスケーリング（例：1000倍）
				stats.Points = int(avgPoints * 1000)
				stats.Gf = int(avgGf * 1000)
				stats.Ga = int(avgGa * 1000)
				stats.Gd = sql.NullInt64{Valid: true, Int64: int64(avgGd * 1000)}
			} else {
				// 試合がない場合は-999的な値を設定
				stats.Points = -999000
				stats.Gf = -999000
				stats.Ga = -999000
				stats.Gd = sql.NullInt64{Valid: true, Int64: -999000}
			}
		}
	}

	// 順位表を配列に変換
	var standings []*db_model.LeagueStanding
	for _, stats := range teamStats {
		standings = append(standings, stats)
	}

	// ソートして順位を決定
	s.sortStandingsWithContext(standings, league.CalculationType)
	s.assignRanksWithContext(standings, league.CalculationType)

	return standings, nil
}

// リーグが完了しているかどうかを判定する内部メソッド
func (s *League) isLeagueFinished(matches []*db_model.Match) bool {
	if len(matches) == 0 {
		return false
	}

	for _, match := range matches {
		if match.Status != "finished" {
			return false
		}
	}
	return true
}

// コンテキストを考慮したソート
func (s *League) sortStandingsWithContext(standings []*db_model.LeagueStanding, calcType string) {
	sort.Slice(standings, func(i, j int) bool {
		if standings[i].Points != standings[j].Points {
			return standings[i].Points > standings[j].Points
		}

		switch calcType {
		case "DIFF_SCORE":
			return standings[i].Gd.Int64 > standings[j].Gd.Int64
		case "TOTAL_SCORE":
			return standings[i].Gf > standings[j].Gf
		default:
			return false
		}
	})
}

// コンテキストを考慮した順位設定
func (s *League) assignRanksWithContext(standings []*db_model.LeagueStanding, calcType string) {
	if len(standings) == 0 {
		return
	}

	standings[0].Rank = 1
	currentRank := 1

	for i := 1; i < len(standings); i++ {
		isSameRank := false

		switch calcType {
		case "DIFF_SCORE":
			if standings[i].Points == standings[i-1].Points &&
				standings[i].Gd.Int64 == standings[i-1].Gd.Int64 {
				isSameRank = true
			}
		case "TOTAL_SCORE":
			if standings[i].Points == standings[i-1].Points &&
				standings[i].Gf == standings[i-1].Gf {
				isSameRank = true
			}
		default:
			if standings[i].Points == standings[i-1].Points {
				isSameRank = true
			}
		}

		if isSameRank {
			standings[i].Rank = currentRank
		} else {
			currentRank = i + 1
			standings[i].Rank = currentRank
		}
	}
}
