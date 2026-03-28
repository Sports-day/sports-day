package service

import (
	"context"
	"database/sql"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Competition struct {
	db                    *gorm.DB
	competitionRepository repository.Competition
	teamRepository        repository.Team
	leagueRepository      repository.League
	matchRepository       repository.Match
	sportsRepository      repository.Sports
}

func NewCompetition(db *gorm.DB, competitionRepository repository.Competition, teamRepository repository.Team, leagueRepository repository.League, matchRepository repository.Match, sportsRepository repository.Sports) Competition {
	return Competition{
		db:                    db,
		competitionRepository: competitionRepository,
		teamRepository:        teamRepository,
		leagueRepository:      leagueRepository,
		matchRepository:       matchRepository,
		sportsRepository:      sportsRepository,
	}
}

func (s *Competition) Create(ctx context.Context, input *model.CreateCompetitionInput) (*db_model.Competition, error) {
	competition := &db_model.Competition{
		ID:   ulid.Make(),
		Name: input.Name,
		Type: input.Type.String(),
	}

	competition, err := s.competitionRepository.Save(ctx, s.db, competition)
	if err != nil {
		return nil, errors.ErrSaveCompetition
	}
	return competition, nil
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
		return nil, errors.ErrAddCompetitionEntry
	}
	return competition, nil
}

func (s *Competition) DeleteEntries(ctx context.Context, competitionId string, teamIds []string) (*db_model.Competition, error) {
	competition, err := s.competitionRepository.Get(ctx, s.db, competitionId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.competitionRepository.DeleteCompetitionEntries(ctx, s.db, competitionId, teamIds)
	if err != nil {
		return nil, errors.ErrDeleteCompetitionEntry
	}
	return competition, nil
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

// TryPromoteFromLeague は子リーグの全試合完了時に進出処理を試行する。
// 1トランザクション内で呼ばれることを前提とする。
func (s *Competition) TryPromoteFromLeague(ctx context.Context, tx *gorm.DB, sourceCompetitionID string) error {
	// 1. 進出ルールを取得
	rules, err := s.competitionRepository.ListBySourceCompetitionID(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(rules) == 0 {
		return nil
	}

	// 2. リーグの順位を計算
	standings, err := s.computeStandingsForPromotion(ctx, tx, sourceCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	// 3. 各ルールについて進出処理
	for _, rule := range rules {
		if err := s.processOneRule(ctx, tx, rule, standings); err != nil {
			return err
		}
	}

	return nil
}

// processOneRule は1つの進出ルールを処理する。
func (s *Competition) processOneRule(ctx context.Context, tx *gorm.DB, rule *db_model.PromotionRule, standings []*model.Standing) error {
	targetRanks, err := ParseRankSpec(rule.RankSpec)
	if err != nil {
		return errors.ErrPromotionRuleInvalid
	}

	// 進出対象の順位が確定しているかチェック
	// 確定 = 対象順位に同順位（同じ Rank で複数チーム）が存在しない
	rankToTeams := make(map[int32][]string)
	for _, st := range standings {
		rankToTeams[st.Rank] = append(rankToTeams[st.Rank], st.TeamID)
	}

	var teamsToPromote []string
	for _, rank := range targetRanks {
		teams := rankToTeams[int32(rank)]
		if len(teams) == 0 {
			// 対象順位のチームが存在しない（チーム数 < 順位数）
			continue
		}
		if len(teams) > 1 {
			// 同順位が残っている → 進出できない
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

	// ステップ2: 期待チーム数到達チェック → 試合生成
	if err := s.tryGenerateMatches(ctx, tx, rule.TargetCompetitionID); err != nil {
		return err
	}

	return nil
}

// tryGenerateMatches は期待チーム数に到達した場合にラウンドロビン試合を自動生成する。
// リーグ→リーグの場合のみ試合生成を行う。
func (s *Competition) tryGenerateMatches(ctx context.Context, tx *gorm.DB, targetCompetitionID string) error {
	targetComp, err := s.competitionRepository.Get(ctx, tx, targetCompetitionID)
	if err != nil {
		return errors.Wrap(err)
	}

	// リーグ→リーグの場合のみ試合自動生成
	if targetComp.Type != "LEAGUE" {
		return nil
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

	// 既に試合があればスキップ
	existingMatches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetCompetitionID})
	if err != nil {
		return errors.Wrap(err)
	}
	if len(existingMatches) > 0 {
		return nil
	}

	// ラウンドロビン試合生成
	teamIDs := make([]string, len(entries))
	for i, e := range entries {
		teamIDs[i] = e.TeamID
	}

	schedule := generateRoundRobinSchedule(teamIDs)
	for _, matchup := range schedule {
		m := &db_model.Match{
			ID:            ulid.Make(),
			Status:        "STANDBY",
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

	// 全進出元のチームを集約（重複排除）
	sourceTeams := make(map[string]bool)
	for _, rule := range rules {
		srcEntries, err := s.competitionRepository.BatchGetCompetitionEntriesByCompetitionIDs(ctx, tx, []string{rule.SourceCompetitionID})
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
		if m.Status != "STANDBY" && m.Status != "CANCELED" {
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

	for _, rule := range rules {
		matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{rule.TargetCompetitionID})
		if err != nil {
			return errors.Wrap(err)
		}
		for _, m := range matches {
			if m.Status != "STANDBY" && m.Status != "CANCELED" {
				return errors.ErrScoreModificationLocked
			}
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
		// 進出先の試合を削除（STANDBY / CANCELED のもののみ）
		matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, tx, []string{targetID})
		if err != nil {
			return errors.Wrap(err)
		}
		for _, m := range matches {
			if m.Status == "FINISHED" || m.Status == "ONGOING" {
				return errors.ErrScoreModificationLocked
			}
			if _, err := s.matchRepository.Delete(ctx, tx, m.ID); err != nil {
				return errors.Wrap(err)
			}
		}

		// このソースから進出したエントリーを削除
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
	}

	// 再度進出処理を試行
	return s.TryPromoteFromLeague(ctx, tx, sourceCompetitionID)
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
		if match.Status == "FINISHED" {
			finishedMatches = append(finishedMatches, match)
			matchIDs = append(matchIDs, match.ID)
		} else if match.Status != "CANCELED" {
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
		if m.Status != "FINISHED" && m.Status != "CANCELED" {
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
