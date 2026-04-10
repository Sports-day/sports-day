package service

import (
	"context"
	"database/sql"
	"math/rand"
	"sort"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	pkggorm "sports-day/api/pkg/gorm"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Competition struct {
	db                    *gorm.DB
	competitionRepository repository.Competition
	teamRepository        repository.Team
	leagueRepository      repository.League
	tournamentRepository  repository.Tournament
	matchRepository       repository.Match
	sportsRepository      repository.Sports
	tournamentService     *Tournament
}

func NewCompetition(db *gorm.DB, competitionRepository repository.Competition, teamRepository repository.Team, leagueRepository repository.League, tournamentRepository repository.Tournament, matchRepository repository.Match, sportsRepository repository.Sports) Competition {
	return Competition{
		db:                    db,
		competitionRepository: competitionRepository,
		teamRepository:        teamRepository,
		leagueRepository:      leagueRepository,
		tournamentRepository:  tournamentRepository,
		matchRepository:       matchRepository,
		sportsRepository:      sportsRepository,
	}
}

// SetTournamentService は循環依存を避けるためにセッター注入する。
func (s *Competition) SetTournamentService(ts *Tournament) {
	s.tournamentService = ts
}

func (s *Competition) Create(ctx context.Context, input *model.CreateCompetitionInput) (*db_model.Competition, error) {
	var result *db_model.Competition

	err := s.db.Transaction(func(tx *gorm.DB) error {
		competitionID := ulid.Make()
		competition := &db_model.Competition{
			ID:      competitionID,
			Name:    input.Name,
			Type:    input.Type.String(),
			SceneID: input.SceneID,
			SportID: sql.NullString{Valid: true, String: input.SportID},
		}

		saved, err := s.competitionRepository.Save(ctx, tx, competition)
		if err != nil {
			return errors.ErrSaveCompetition
		}

		// LEAGUE型の場合はLeagueレコードも自動作成
		if input.Type == model.CompetitionTypeLeague {
			league := &db_model.League{
				ID:     competitionID,
				WinPt:  3,
				DrawPt: 1,
				LosePt: 0,
			}
			if _, err := s.leagueRepository.Save(ctx, tx, league); err != nil {
				return errors.ErrSaveLeague
			}
		}

		// TOURNAMENT型の場合はMAINトーナメントレコードを自動作成
		if input.Type == model.CompetitionTypeTournament {
			tournament := &db_model.Tournament{
				ID:            ulid.Make(),
				CompetitionID: competitionID,
				Name:          input.Name,
				BracketType:   string(model.BracketTypeMain),
				DisplayOrder:  1,
			}
			if _, err := s.tournamentRepository.Save(ctx, tx, tournament); err != nil {
				return errors.ErrSaveTournament
			}
		}

		result = saved
		return nil
	})
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Competition) Get(ctx context.Context, id string) (*db_model.Competition, error) {
	competition, err := s.competitionRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return competition, nil
}

func (s *Competition) Update(ctx context.Context, id string, input model.UpdateCompetitionInput) (*db_model.Competition, error) {
	competition, err := s.competitionRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Name != nil {
		competition.Name = *input.Name
	}
	if input.SceneID != nil {
		competition.SceneID = *input.SceneID
	}
	if input.SportID != nil {
		competition.SportID = sql.NullString{Valid: true, String: *input.SportID}
	}

	competition, err = s.competitionRepository.Save(ctx, s.db, competition)
	if err != nil {
		return nil, errors.ErrSaveCompetition
	}
	return competition, nil
}

func (s *Competition) Delete(ctx context.Context, id string) (*db_model.Competition, error) {
	competition, err := s.competitionRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return competition, nil
}

func (s *Competition) List(ctx context.Context) ([]*db_model.Competition, error) {
	competitions, err := s.competitionRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return competitions, nil
}

func (s *Competition) AddEntries(ctx context.Context, competitionId string, teamIds []string) (*db_model.Competition, error) {
	var competition *db_model.Competition

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 進行中/終了試合チェック
		if err := s.checkNoMatchesInProgress(ctx, tx, competitionId); err != nil {
			return err
		}

		// tx を使って大会取得
		comp, err := s.competitionRepository.Get(ctx, tx, competitionId)
		if err != nil {
			return errors.Wrap(err)
		}
		competition = comp

		// エントリー追加
		if _, err := s.competitionRepository.AddCompetitionEntries(ctx, tx, competitionId, teamIds); err != nil {
			return errors.Wrap(err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return competition, nil
}

func (s *Competition) DeleteEntries(ctx context.Context, competitionId string, teamIds []string) (*db_model.Competition, error) {
	var competition *db_model.Competition

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 進行中/終了試合チェック
		if err := s.checkNoMatchesInProgress(ctx, tx, competitionId); err != nil {
			return err
		}

		comp, err := s.competitionRepository.Get(ctx, tx, competitionId)
		if err != nil {
			return errors.Wrap(err)
		}
		competition = comp

		if _, err := s.competitionRepository.DeleteCompetitionEntries(ctx, tx, competitionId, teamIds); err != nil {
			return errors.Wrap(err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}
	return competition, nil
}

// checkNoMatchesInProgress は大会内にONGOINGまたはFINISHEDの試合がないことを確認する。
func (s *Competition) checkNoMatchesInProgress(ctx context.Context, tx *gorm.DB, competitionId string) error {
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{competitionId})
	if err != nil {
		return errors.Wrap(err)
	}
	for _, m := range matches {
		if m.Status == "ONGOING" || m.Status == "FINISHED" {
			return errors.ErrMatchesInProgress
		}
	}
	return nil
}

func (s *Competition) GetCompetitionsMapByIDs(ctx context.Context, competitionIDs []string) (map[string]*db_model.Competition, error) {
	competitions, err := s.competitionRepository.BatchGet(ctx, s.db, competitionIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	competitionMap := make(map[string]*db_model.Competition)
	for _, competition := range competitions {
		competitionMap[competition.ID] = competition
	}
	return competitionMap, nil
}

func (s *Competition) GetCompetitionEntriesMapByTeamIDs(ctx context.Context, teamIds []string) (map[string][]*db_model.CompetitionEntry, error) {
	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByTeamIDs(ctx, s.db, teamIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	competitionEntriesMap := make(map[string][]*db_model.CompetitionEntry)
	for _, competitionEntry := range competitionEntries {
		competitionEntriesMap[competitionEntry.TeamID] = append(competitionEntriesMap[competitionEntry.TeamID], competitionEntry)
	}
	return competitionEntriesMap, nil
}

func (s *Competition) GetCompetitionEntriesMapByCompetitionIDs(ctx context.Context, competitionIds []string) (map[string][]*db_model.CompetitionEntry, error) {
	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, s.db, competitionIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	competitionEntriesMap := make(map[string][]*db_model.CompetitionEntry)
	for _, competitionEntry := range competitionEntries {
		competitionEntriesMap[competitionEntry.CompetitionID] = append(competitionEntriesMap[competitionEntry.CompetitionID], competitionEntry)
	}
	return competitionEntriesMap, nil
}

// CreateRule は進出ルールを作成する。変更制限のバリデーションを含む。
func (s *Competition) CreateRule(ctx context.Context, input *model.CreatePromotionRuleInput) (*db_model.PromotionRule, error) {
	// rank_spec バリデーション
	if _, err := ParseRankSpec(input.RankSpec); err != nil {
		return nil, errors.ErrPromotionRuleInvalid
	}

	// slot 指定時は単体指定のみ許可
	if input.Slot != nil && !IsSingleRank(input.RankSpec) {
		return nil, errors.ErrPromotionRuleInvalid
	}

	var rule *db_model.PromotionRule
	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 進出先の変更制限チェック
		if err := s.checkTargetNotScored(ctx, tx, input.TargetCompetitionID); err != nil {
			return err
		}

		// ソースがトーナメントの場合: rank_spec がブラケット構造で一意に確定するか検証
		if s.tournamentService != nil {
			source, err := s.competitionRepository.Get(ctx, tx, input.SourceCompetitionID)
			if err != nil {
				return errors.Wrap(err)
			}
			if source.Type == string(model.CompetitionTypeTournament) {
				if err := s.tournamentService.ValidateRankSpecForTournament(ctx, tx, input.SourceCompetitionID, input.RankSpec); err != nil {
					return err
				}
			}
		}

		var slotVal sql.NullInt64
		if input.Slot != nil {
			slotVal = sql.NullInt64{Valid: true, Int64: int64(*input.Slot)}
		}

		rule = &db_model.PromotionRule{
			ID:                  ulid.Make(),
			SourceCompetitionID: input.SourceCompetitionID,
			TargetCompetitionID: input.TargetCompetitionID,
			RankSpec:            input.RankSpec,
			Slot:                slotVal,
		}

		var err error
		rule, err = s.competitionRepository.SavePromotionRule(ctx, tx, rule)
		if err != nil {
			return errors.ErrSavePromotionRule
		}
		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

// UpdateRule は進出ルールを更新する。変更制限のバリデーションを含む。
func (s *Competition) UpdateRule(ctx context.Context, id string, input *model.UpdatePromotionRuleInput) (*db_model.PromotionRule, error) {
	var rule *db_model.PromotionRule
	err := s.db.Transaction(func(tx *gorm.DB) error {
		var err error
		rule, err = s.competitionRepository.GetPromotionRule(ctx, tx, id)
		if err != nil {
			return err
		}

		// 進出先の変更制限チェック
		if err := s.checkTargetNotScored(ctx, tx, rule.TargetCompetitionID); err != nil {
			return err
		}

		if input.RankSpec != nil {
			if _, err := ParseRankSpec(*input.RankSpec); err != nil {
				return errors.ErrPromotionRuleInvalid
			}
			rule.RankSpec = *input.RankSpec
		}

		if input.Slot != nil {
			rule.Slot = sql.NullInt64{Valid: true, Int64: int64(*input.Slot)}
		}

		// slot 指定時は単体指定のみ許可
		if rule.Slot.Valid && !IsSingleRank(rule.RankSpec) {
			return errors.ErrPromotionRuleInvalid
		}

		// ソースがトーナメントの場合: rank_spec がブラケット構造で一意に確定するか検証
		if s.tournamentService != nil {
			source, err := s.competitionRepository.Get(ctx, tx, rule.SourceCompetitionID)
			if err != nil {
				return errors.Wrap(err)
			}
			if source.Type == string(model.CompetitionTypeTournament) {
				if err := s.tournamentService.ValidateRankSpecForTournament(ctx, tx, rule.SourceCompetitionID, rule.RankSpec); err != nil {
					return err
				}
			}
		}

		rule, err = s.competitionRepository.SavePromotionRule(ctx, tx, rule)
		if err != nil {
			return errors.ErrSavePromotionRule
		}

		// 副作用: エントリー・試合を再構成
		if err := s.ReconstructPromotions(ctx, tx, rule.SourceCompetitionID); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

// DeleteRule は進出ルールを削除する。変更制限のバリデーションを含む。
func (s *Competition) DeleteRule(ctx context.Context, id string) (*db_model.PromotionRule, error) {
	var rule *db_model.PromotionRule
	err := s.db.Transaction(func(tx *gorm.DB) error {
		var err error
		rule, err = s.competitionRepository.GetPromotionRule(ctx, tx, id)
		if err != nil {
			return err
		}

		// 進出先の変更制限チェック
		if err := s.checkTargetNotScored(ctx, tx, rule.TargetCompetitionID); err != nil {
			return err
		}

		rule, err = s.competitionRepository.DeletePromotionRule(ctx, tx, id)
		if err != nil {
			return err
		}

		// 副作用: エントリー・試合を再構成
		if err := s.ReconstructPromotions(ctx, tx, rule.SourceCompetitionID); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return rule, nil
}

// ListRulesBySource は進出元の大会IDで進出ルールを取得する。
func (s *Competition) ListRulesBySource(ctx context.Context, sourceCompetitionID string) ([]*db_model.PromotionRule, error) {
	return s.competitionRepository.ListBySourceCompetitionID(ctx, s.db, sourceCompetitionID)
}

// GetPromotionStatus は進出先の期待チーム数と現在のエントリー数を返す。
func (s *Competition) GetPromotionStatus(ctx context.Context, targetCompetitionID string) (*model.PromotionStatus, error) {
	expected, err := s.calcExpectedTeamCount(ctx, s.db, targetCompetitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, s.db, []string{targetCompetitionID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	return &model.PromotionStatus{
		TargetCompetitionID: targetCompetitionID,
		ExpectedTeamCount:   int32(expected),
		CurrentEntryCount:   int32(len(entries)),
	}, nil
}

// promotionRankEntry は進出処理用の順位エントリー（リーグ/トーナメント共通）
type promotionRankEntry struct {
	rank   int
	teamID string
	isTied bool
}

// TryPromote はソース competition の全試合完了時に進出処理を試行する。
// リーグ・トーナメント両方に対応。1トランザクション内で呼ばれることを前提とする。
func (s *Competition) TryPromote(ctx context.Context, tx *gorm.DB, sourceCompetitionID string) error {
	// 1. 進出ルールを取得
	rules, err := s.competitionRepository.ListBySourceCompetitionID(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	// 2. ソースの種別に応じて順位を取得
	source, err := s.competitionRepository.Get(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	var rankings []promotionRankEntry

	switch source.Type {
	case string(model.CompetitionTypeLeague):
		standings, err := s.computeStandingsForPromotion(ctx, tx, sourceCompetitionID)
		if err != nil {
			return errors.Wrap(err)
		}
		rankings = standingsToRankEntries(standings)
	case string(model.CompetitionTypeTournament):
		if s.tournamentService == nil {
			return nil
		}
		tournamentRankings, err := s.tournamentService.ComputeTournamentRankingTx(ctx, tx, sourceCompetitionID)
		if err != nil {
			return errors.Wrap(err)
		}
		rankings = tournamentRankingsToRankEntries(tournamentRankings)
	default:
		return nil
	}

	// 3. 各ルールについて進出処理
	for _, rule := range rules {
		if err := s.processOneRule(ctx, tx, rule, rankings); err != nil {
			return err
		}
	}

	return nil
}

// standingsToRankEntries はリーグ順位を共通の進出用エントリーに変換する。
func standingsToRankEntries(standings []*model.Standing) []promotionRankEntry {
	entries := make([]promotionRankEntry, len(standings))
	for i, st := range standings {
		entries[i] = promotionRankEntry{
			rank:   int(st.Rank),
			teamID: st.TeamID,
			isTied: false, // リーグは同率が processOneRule 側で判定される
		}
	}
	return entries
}

// tournamentRankingsToRankEntries はトーナメント順位を共通の進出用エントリーに変換する。
func tournamentRankingsToRankEntries(rankings []*model.TournamentRanking) []promotionRankEntry {
	entries := make([]promotionRankEntry, len(rankings))
	for i, r := range rankings {
		entries[i] = promotionRankEntry{
			rank:   int(r.Rank),
			teamID: r.TeamID,
			isTied: r.IsTied,
		}
	}
	return entries
}

// processOneRule は1つの進出ルールを処理する。
func (s *Competition) processOneRule(ctx context.Context, tx *gorm.DB, rule *db_model.PromotionRule, rankings []promotionRankEntry) error {
	targetRanks, err := ParseRankSpec(rule.RankSpec)
	if err != nil {
		return errors.ErrPromotionRuleInvalid
	}

	// 進出対象の順位が確定しているかチェック
	// 確定 = 対象順位に同順位（同じ Rank で複数チーム）が存在しない、かつ isTied=false
	rankToTeams := make(map[int][]string)
	rankIsTied := make(map[int]bool)
	for _, r := range rankings {
		rankToTeams[r.rank] = append(rankToTeams[r.rank], r.teamID)
		if r.isTied {
			rankIsTied[r.rank] = true
		}
	}

	var teamsToPromote []string
	for _, rank := range targetRanks {
		teams := rankToTeams[rank]
		if len(teams) == 0 {
			// 対象順位のチームが存在しない（チーム数 < 順位数）
			continue
		}
		if len(teams) > 1 || rankIsTied[rank] {
			// 同順位が残っている or トーナメントで未確定 → 進出できない
			return nil
		}
		teamsToPromote = append(teamsToPromote, teams[0])
	}

	if len(teamsToPromote) == 0 {
		return nil
	}

	// 進出先の既存エントリーを取得（重複チェック用）
	existingEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.TargetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}
	existingTeams := make(map[string]bool)
	for _, e := range existingEntries {
		existingTeams[e.TeamID] = true
	}

	// 新規チームのみ追加
	var newTeams []string
	for _, tid := range teamsToPromote {
		if !existingTeams[tid] {
			newTeams = append(newTeams, tid)
		}
	}

	if len(newTeams) == 0 {
		return nil
	}

	// エントリー作成
	if _, err := s.competitionRepository.AddCompetitionEntries(ctx, tx, rule.TargetCompetitionID, newTeams); err != nil {
		return errors.Wrap(err)
	}

	// MANUAL配置: slot が指定されている場合、即座にSEEDスロットに配置
	if rule.Slot.Valid && s.tournamentService != nil && len(newTeams) == 1 {
		targetComp, err := s.competitionRepository.Get(ctx, tx, rule.TargetCompetitionID)
		if err != nil {
			return errors.Wrap(err)
		}
		if targetComp.Type == string(model.CompetitionTypeTournament) {
			mainTournament, err := s.tournamentService.GetMainByCompetitionIDTx(ctx, tx, rule.TargetCompetitionID)
			if err != nil {
				return errors.Wrap(err)
			}
			slot, err := s.tournamentService.GetSeedSlotTx(ctx, tx, mainTournament.ID, rule.Slot.Int64)
			if err != nil {
				return errors.Wrap(err)
			}
			if err := s.matchRepository.UpdateMatchEntryTeamID(ctx, tx, slot.MatchEntryID, newTeams[0]); err != nil {
				return errors.Wrap(err)
			}
		}
	}

	// ステップ2: 期待チーム数到達チェック → 試合生成 or プリセットSEED配置
	if err := s.tryGenerateMatches(ctx, tx, rule.TargetCompetitionID); err != nil {
		return err
	}

	return nil
}

// tryGenerateMatches は期待チーム数に到達した場合に試合生成またはSEED配置を行う。
// 進出先がリーグの場合: ラウンドロビン試合生成
// 進出先がトーナメントの場合: SEEDスロットへのチーム配置
func (s *Competition) tryGenerateMatches(ctx context.Context, tx *gorm.DB, targetCompetitionID string) error {
	targetComp, err := s.competitionRepository.Get(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	expected, err := s.calcExpectedTeamCount(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}

	if len(entries) < expected || expected < 2 {
		return nil
	}

	switch targetComp.Type {
	case string(model.CompetitionTypeLeague):
		return s.tryGenerateLeagueMatches(ctx, tx, targetCompetitionID, entries)
	case string(model.CompetitionTypeTournament):
		return s.tryPlaceSeedTeams(ctx, tx, targetCompetitionID, entries)
	}

	return nil
}

// tryGenerateLeagueMatches はリーグのラウンドロビン試合を自動生成する。
func (s *Competition) tryGenerateLeagueMatches(ctx context.Context, tx *gorm.DB, targetCompetitionID string, entries []*db_model.CompetitionEntry) error {
	// 既に試合があればスキップ
	existingMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}
	if len(existingMatches) > 0 {
		return nil
	}

	teamIDs := make([]string, len(entries))
	for i, e := range entries {
		teamIDs[i] = e.TeamID
	}

	schedule := generateRoundRobinSchedule(teamIDs)
	for _, matchup := range schedule {
		m := &db_model.Match{
			ID:            ulid.Make(),
			Status:        string(model.MatchStatusStandby),
			CompetitionID: targetCompetitionID,
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

// tryPlaceSeedTeams はトーナメントのSEEDスロットにチームを配置する。
// placement_method に応じてスロット割当アルゴリズムを選択する。
func (s *Competition) tryPlaceSeedTeams(ctx context.Context, tx *gorm.DB, targetCompetitionID string, entries []*db_model.CompetitionEntry) error {
	if s.tournamentService == nil {
		return nil
	}

	// MAINブラケットを取得
	mainTournament, err := s.tournamentService.GetMainByCompetitionIDTx(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	// SEEDスロットを取得（seed_number 昇順）
	seedSlots, err := s.tournamentService.ListSeedSlotsByTournamentIDTx(ctx, tx, mainTournament.ID)
	if err != nil {
		return errors.Wrap(err)
	}

	if len(seedSlots) == 0 {
		return nil
	}

	// placement_method に応じたスロット割当を計算
	placementMethod := "SEED_OPTIMIZED" // デフォルト
	if mainTournament.PlacementMethod.Valid {
		placementMethod = mainTournament.PlacementMethod.String
	}

	// MANUAL配置は processOneRule 側で個別に処理するためここではスキップ
	if placementMethod == "MANUAL" {
		return nil
	}

	// シード順のチームリストを構築: 進出ルールの rank_spec 順にチームを並べる
	teamIDs, err := s.buildSeedOrderedTeams(ctx, tx, targetCompetitionID, entries)
	if err != nil {
		return errors.Wrap(err)
	}

	// seed_number → slot のマップ
	seedSlotMap := make(map[int64]*db_model.TournamentSlot)
	for _, slot := range seedSlots {
		if slot.SeedNumber.Valid {
			seedSlotMap[slot.SeedNumber.Int64] = slot
		}
	}

	// プリセット配置: チームIDをseed_numberに対応付ける
	seedAssignment := computeSeedAssignment(placementMethod, teamIDs)

	// スロットに team_id を書き込み
	for seedNum, teamID := range seedAssignment {
		slot, ok := seedSlotMap[int64(seedNum)]
		if !ok {
			continue
		}
		if err := s.matchRepository.UpdateMatchEntryTeamID(ctx, tx, slot.MatchEntryID, teamID); err != nil {
			return errors.Wrap(err)
		}
	}

	return nil
}

// buildSeedOrderedTeams は進出ルールの順序に従ってシード順のチームリストを構築する。
// 各ルールの processOneRule で追加される順序（rank 昇順）がシード順になる。
func (s *Competition) buildSeedOrderedTeams(ctx context.Context, tx *gorm.DB, targetCompetitionID string, entries []*db_model.CompetitionEntry) ([]string, error) {
	rules, err := s.competitionRepository.ListByTargetCompetitionID(ctx, tx, targetCompetitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	entryTeams := make(map[string]bool)
	for _, e := range entries {
		entryTeams[e.TeamID] = true
	}

	var ordered []string
	seen := make(map[string]bool)
	sourceRankings := make(map[string][]promotionRankEntry)

	for _, rule := range rules {
		// キャッシュ済みの場合はDB呼び出しをスキップ
		rankings, cached := sourceRankings[rule.SourceCompetitionID]
		if !cached {
			source, err := s.competitionRepository.Get(ctx, tx, rule.SourceCompetitionID)
			if err != nil {
				return nil, errors.Wrap(err)
			}

			switch source.Type {
			case string(model.CompetitionTypeLeague):
				standings, err := s.computeStandingsForPromotion(ctx, tx, rule.SourceCompetitionID)
				if err != nil {
					return nil, errors.Wrap(err)
				}
				rankings = standingsToRankEntries(standings)
			case string(model.CompetitionTypeTournament):
				if s.tournamentService == nil {
					continue
				}
				tournamentRankings, err := s.tournamentService.ComputeTournamentRankingTx(ctx, tx, rule.SourceCompetitionID)
				if err != nil {
					return nil, errors.Wrap(err)
				}
				rankings = tournamentRankingsToRankEntries(tournamentRankings)
			}
			sourceRankings[rule.SourceCompetitionID] = rankings
		}

		targetRanks, err := ParseRankSpec(rule.RankSpec)
		if err != nil {
			continue
		}

		rankToTeams := make(map[int][]string)
		for _, r := range rankings {
			rankToTeams[r.rank] = append(rankToTeams[r.rank], r.teamID)
		}

		for _, rank := range targetRanks {
			tids, ok := rankToTeams[rank]
			if !ok {
				continue
			}
			for _, tid := range tids {
				if !entryTeams[tid] || seen[tid] {
					continue
				}
				ordered = append(ordered, tid)
				seen[tid] = true
			}
		}
	}

	// 手動エントリー（進出ルール経由でないチーム）を末尾に追加
	for _, e := range entries {
		if !seen[e.TeamID] {
			ordered = append(ordered, e.TeamID)
			seen[e.TeamID] = true
		}
	}

	return ordered, nil
}

// computeSeedAssignment は placement_method に応じて seed_number → teamID のマッピングを返す。
// teamIDs はシード順（1位→末尾）で並んでいる前提。
func computeSeedAssignment(placementMethod string, teamIDs []string) map[int]string {
	result := make(map[int]string)
	n := len(teamIDs)

	switch placementMethod {
	case "SEED_OPTIMIZED", "BALANCED":
		// 順位順にseed 1,2,3,...を割り当て。
		// SEED_OPTIMIZED: ブラケット構造側で最適化済み → seed順=順位順
		// BALANCED: 上位と下位が序盤で対戦する対称配置 → seed順=順位順
		// TODO: 将来的に BALANCED で独自の配置ロジックが必要になった場合は分離する
		for i, tid := range teamIDs {
			result[i+1] = tid
		}
	case "RANDOM":
		// Fisher-Yates シャッフル
		shuffled := make([]string, n)
		copy(shuffled, teamIDs)
		for i := n - 1; i > 0; i-- {
			j := rand.Intn(i + 1)
			shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
		}
		for i, tid := range shuffled {
			result[i+1] = tid
		}
	default:
		// フォールバック: 順位順
		for i, tid := range teamIDs {
			result[i+1] = tid
		}
	}

	return result
}

// calcExpectedTeamCount は進出先の期待チーム数を算出する。
// 期待チーム数 = promotion_rules の rank_spec 合算 + 手動エントリー数
//
// 手動エントリーの判定:
//
//	進出先のエントリーのうち、いずれかの進出元にも属するチームは「自動進出」とみなし、
//	それ以外を「手動エントリー」として加算する。
//	同一チームが複数の進出元に属する場合でも1回だけカウントする。
func (s *Competition) calcExpectedTeamCount(ctx context.Context, tx *gorm.DB, targetCompetitionID string) (int, error) {
	rules, err := s.competitionRepository.ListByTargetCompetitionID(ctx, tx, targetCompetitionID)
	if err != nil {
		return 0, errors.Wrap(err)
	}

	autoCount := 0
	for _, rule := range rules {
		cnt, err := CountRanksFromSpec(rule.RankSpec)
		if err != nil {
			return 0, errors.Wrap(err)
		}
		autoCount += cnt
	}

	entries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return 0, errors.Wrap(err)
	}

	// 全進出元のチームを一括取得（重複排除）
	sourceCompIDs := make([]string, len(rules))
	for i, rule := range rules {
		sourceCompIDs[i] = rule.SourceCompetitionID
	}
	sourceTeams := make(map[string]bool)
	if len(sourceCompIDs) > 0 {
		srcEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, sourceCompIDs)
		if err != nil {
			return 0, errors.Wrap(err)
		}
		for _, e := range srcEntries {
			sourceTeams[e.TeamID] = true
		}
	}

	// 進出先エントリーのうち、進出元に属さないチームを手動エントリーとする
	manualEntries := 0
	for _, e := range entries {
		if !sourceTeams[e.TeamID] {
			manualEntries++
		}
	}

	return autoCount + manualEntries, nil
}

// checkTargetNotScored は進出先の試合が稼働中でないか確認する。
// FINISHED または ONGOING の試合が1つでもあれば変更不可。
// NOTE: DB設計上 score=0 と「未入力」は区別できないため、status ベースで判定に統一する。
func (s *Competition) checkTargetNotScored(ctx context.Context, tx *gorm.DB, targetCompetitionID string) error {
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}
	for _, m := range matches {
		if m.Status != string(model.MatchStatusStandby) && m.Status != string(model.MatchStatusCanceled) {
			return errors.ErrPromotionRuleLocked
		}
	}
	return nil
}

// CheckScoreModificationAllowed は子リーグのスコア修正が許可されているかチェックする。
// 進出先の試合が1つでも動いていれば修正不可。
// NOTE: DB設計上 score=0 と「未入力」は区別できないため、status ベースで判定に統一する。
func (s *Competition) CheckScoreModificationAllowed(ctx context.Context, tx *gorm.DB, sourceCompetitionID string) error {
	rules, err := s.competitionRepository.ListBySourceCompetitionID(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	targetCompIDs := make([]string, len(rules))
	for i, rule := range rules {
		targetCompIDs[i] = rule.TargetCompetitionID
	}
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, targetCompIDs)
	if err != nil {
		return errors.Wrap(err)
	}
	for _, m := range matches {
		if m.Status != string(model.MatchStatusStandby) && m.Status != string(model.MatchStatusCanceled) {
			return errors.ErrScoreModificationLocked
		}
	}
	return nil
}

// ReconstructPromotions は子リーグのスコア修正後に進出エントリーと試合を再構成する。
func (s *Competition) ReconstructPromotions(ctx context.Context, tx *gorm.DB, sourceCompetitionID string) error {
	rules, err := s.competitionRepository.ListBySourceCompetitionID(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	// target competition ごとに、このソースからの自動エントリーを特定して削除→再作成
	targetIDs := make(map[string]bool)
	for _, rule := range rules {
		targetIDs[rule.TargetCompetitionID] = true
	}

	for targetID := range targetIDs {
		targetComp, err := s.competitionRepository.Get(ctx, tx, targetID)
		if err != nil {
			return errors.Wrap(err)
		}

		if targetComp.Type == string(model.CompetitionTypeTournament) && s.tournamentService != nil {
			// トーナメント進出先: SEEDスロットの team_id クリア + 後続巻き戻し
			if err := s.reconstructTournamentTarget(ctx, tx, targetID, sourceCompetitionID); err != nil {
				return err
			}
		} else {
			// リーグ進出先: 試合削除 + エントリー削除
			if err := s.reconstructLeagueTarget(ctx, tx, targetID, sourceCompetitionID); err != nil {
				return err
			}
		}
	}

	// 再度進出処理を試行
	return s.TryPromote(ctx, tx, sourceCompetitionID)
}

// reconstructLeagueTarget はリーグ進出先の再構成を行う。
func (s *Competition) reconstructLeagueTarget(ctx context.Context, tx *gorm.DB, targetID string, sourceCompetitionID string) error {
	// 進出先の試合を削除（STANDBY / CANCELED のもののみ）
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetID})
	if err != nil {
		return errors.Wrap(err)
	}
	for _, m := range matches {
		if m.Status == string(model.MatchStatusFinished) || m.Status == string(model.MatchStatusOngoing) {
			return errors.ErrScoreModificationLocked
		}
		if _, err := s.matchRepository.Delete(ctx, tx, m.ID); err != nil {
			return errors.Wrap(err)
		}
	}

	return s.removeAutoPromotedEntries(ctx, tx, targetID, sourceCompetitionID)
}

// reconstructTournamentTarget はトーナメント進出先の再構成を行う。
// ブラケット構造は変更せず、SEEDスロットの team_id クリア + 後続巻き戻し。
func (s *Competition) reconstructTournamentTarget(ctx context.Context, tx *gorm.DB, targetID string, sourceCompetitionID string) error {
	// 進出先の全試合がSTANDBY/CANCELEDであることを確認
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetID})
	if err != nil {
		return errors.Wrap(err)
	}
	for _, m := range matches {
		if m.Status == string(model.MatchStatusFinished) || m.Status == string(model.MatchStatusOngoing) {
			return errors.ErrScoreModificationLocked
		}
	}

	// MAINブラケットのSEEDスロットの team_id をクリアし、後続スロットを巻き戻す
	mainTournament, err := s.tournamentService.GetMainByCompetitionIDTx(ctx, tx, targetID)
	if err != nil {
		return errors.Wrap(err)
	}

	seedSlots, err := s.tournamentService.ListSeedSlotsByTournamentIDTx(ctx, tx, mainTournament.ID)
	if err != nil {
		return errors.Wrap(err)
	}

	for _, slot := range seedSlots {
		// SEEDスロットの match_entry.team_id をクリア
		entry, err := s.matchRepository.GetMatchEntryByID(ctx, tx, slot.MatchEntryID)
		if err != nil {
			return errors.Wrap(err)
		}
		if entry.TeamID.Valid {
			if err := s.matchRepository.ClearMatchEntryTeamID(ctx, tx, slot.MatchEntryID); err != nil {
				return errors.Wrap(err)
			}
			// そのエントリーが属するmatchを起点にrollbackFromMatchを呼ぶ
			if err := s.tournamentService.RollbackFromMatch(ctx, tx, entry.MatchID); err != nil {
				return errors.Wrap(err)
			}
		}
	}

	return s.removeAutoPromotedEntries(ctx, tx, targetID, sourceCompetitionID)
}

// removeAutoPromotedEntries はソースから自動進出したエントリーを削除する。
func (s *Competition) removeAutoPromotedEntries(ctx context.Context, tx *gorm.DB, targetID string, sourceCompetitionID string) error {
	srcEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{sourceCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}
	srcTeams := make(map[string]bool)
	for _, e := range srcEntries {
		srcTeams[e.TeamID] = true
	}

	targetEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{targetID})
	if err != nil {
		return errors.Wrap(err)
	}
	var teamsToRemove []string
	for _, e := range targetEntries {
		if srcTeams[e.TeamID] {
			teamsToRemove = append(teamsToRemove, e.TeamID)
		}
	}
	if len(teamsToRemove) > 0 {
		if _, err := s.competitionRepository.DeleteCompetitionEntries(ctx, tx, targetID, teamsToRemove); err != nil {
			return errors.Wrap(err)
		}
	}
	return nil
}

// computeStandingsForPromotion は進出処理のために順位を計算する。
func (s *Competition) computeStandingsForPromotion(ctx context.Context, tx *gorm.DB, leagueID string) ([]*model.Standing, error) {
	league, err := s.leagueRepository.Get(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	comp, err := s.competitionRepository.Get(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var rankingRules []*db_model.RankingRule
	if comp.SportID.Valid {
		rankingRules, err = s.sportsRepository.ListRankingRules(ctx, tx, comp.SportID.String)
		if err != nil {
			return nil, errors.Wrap(err)
		}
	}

	competitionEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

	allMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{leagueID})
	if err != nil {
		return nil, errors.Wrap(err)
	}

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

	var entriesByMatch map[string][]*db_model.MatchEntry
	if len(matchIDs) > 0 {
		matchEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
		if err != nil {
			return nil, errors.Wrap(err)
		}
		entriesByMatch = indexEntriesByMatchID(matchEntries)
	} else {
		entriesByMatch = make(map[string][]*db_model.MatchEntry)
	}

	tiebreakPriorities, err := s.leagueRepository.ListTiebreakPriorities(ctx, tx, leagueID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

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

// IsAllMatchesComplete は指定 competition の全試合が完了状態かを判定する。
func (s *Competition) IsAllMatchesComplete(ctx context.Context, tx *gorm.DB, competitionID string) (bool, error) {
	allMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{competitionID})
	if err != nil {
		return false, errors.Wrap(err)
	}
	if len(allMatches) == 0 {
		return false, nil
	}
	for _, m := range allMatches {
		if m.Status != string(model.MatchStatusFinished) && m.Status != string(model.MatchStatusCanceled) {
			return false, nil
		}
	}
	return true, nil
}

// generateRoundRobinSchedule は偶数/奇数対応のラウンドロビンスケジュールを生成する。
func generateRoundRobinSchedule(teamIDs []string) [][2]string {
	n := len(teamIDs)
	if n < 2 {
		return nil
	}
	if n%2 == 0 {
		return generateEvenRR(teamIDs)
	}
	return generateOddRR(teamIDs)
}

func generateEvenRR(teamIDs []string) [][2]string {
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

func generateOddRR(teamIDs []string) [][2]string {
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

func (s *Competition) FindBySceneID(ctx context.Context, sceneID string) ([]*db_model.Competition, error) {
	competitions, err := s.competitionRepository.FindBySceneID(ctx, s.db, sceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return competitions, nil
}

// ApplyDefaults は大会のスケジュールパラメータを保存し、試合時間を自動適用する。
// 手動設定された試合は変更せず、新たな基準点として後続の試合時間をずらす。
func (s *Competition) ApplyDefaults(ctx context.Context, id string, input *model.ApplyCompetitionDefaultsInput) ([]*db_model.Match, error) {
	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	var allMatches []*db_model.Match

	err = s.db.Transaction(func(tx *gorm.DB) error {
		// 1. スケジュールパラメータをcompetitionに保存
		comp, err := s.competitionRepository.Get(ctx, tx, id)
		if err != nil {
			return errors.Wrap(err)
		}

		comp.StartTime = sql.NullTime{Valid: true, Time: startTime}
		comp.MatchDuration = sql.NullInt64{Valid: true, Int64: int64(input.MatchDuration)}
		comp.BreakDuration = sql.NullInt64{Valid: true, Int64: int64(input.BreakDuration)}
		comp.DefaultLocationID = pkggorm.ToNullString(input.LocationID)

		if _, err := s.competitionRepository.Save(ctx, tx, comp); err != nil {
			return errors.ErrSaveCompetition
		}

		// 2. 大会の全試合を取得
		matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{id})
		if err != nil {
			return errors.Wrap(err)
		}

		// 3. ID順（ULID=生成順）にソート
		sort.Slice(matches, func(i, j int) bool {
			return matches[i].ID < matches[j].ID
		})

		// 4. 手動変更を基準点として後続試合の時間をずらすロジック
		interval := time.Duration(input.MatchDuration+input.BreakDuration) * time.Minute
		anchor := startTime
		autoIndex := 0

		// デフォルト場所の設定
		locationID := pkggorm.ToNullString(input.LocationID)

		for _, m := range matches {
			needsSave := false

			// 時間の適用
			if m.TimeManual {
				// 手動設定: 時間は変更せず、新たな基準点にする
				anchor = m.Time.Add(interval)
				autoIndex = 0
			} else {
				// 自動設定: anchor + autoIndex * interval
				m.Time = anchor.Add(time.Duration(autoIndex) * interval)
				needsSave = true
				autoIndex++
			}

			// 場所の適用: 手動設定でない試合のみ
			if !m.LocationManual && locationID.Valid {
				m.LocationID = locationID
				needsSave = true
			}

			if needsSave {
				if _, err := s.matchRepository.Save(ctx, tx, m); err != nil {
					return errors.ErrSaveMatch
				}
			}
		}

		allMatches = matches
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return allMatches, nil
}
