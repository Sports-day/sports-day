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
	pkggorm "sports-day/api/pkg/gorm"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Tournament struct {
	db                    *gorm.DB
	tournamentRepository  repository.Tournament
	matchRepository       repository.Match
	competitionRepository repository.Competition
	judgmentRepository    repository.Judgment
	competitionService    *Competition
}

func NewTournament(db *gorm.DB, tournamentRepository repository.Tournament, matchRepository repository.Match, competitionRepository repository.Competition, judgmentRepository repository.Judgment) Tournament {
	return Tournament{
		db:                    db,
		tournamentRepository:  tournamentRepository,
		matchRepository:       matchRepository,
		competitionRepository: competitionRepository,
		judgmentRepository:    judgmentRepository,
	}
}

// SetCompetitionService は循環依存を避けるためにセッター注入する。
func (s *Tournament) SetCompetitionService(cs *Competition) {
	s.competitionService = cs
}

// --- エラー定義 ---

var (
	ErrBracketAlreadyExists       = errors.NewError("BRACKET_ALREADY_EXISTS", "ブラケットが既に存在します。resetTournamentBracketsで削除してから再生成してください")
	ErrMainBracketDeleteForbidden = errors.NewError("MAIN_BRACKET_DELETE_FORBIDDEN", "MAINブラケットは削除できません")
	ErrDuplicateMainBracket       = errors.NewError("DUPLICATE_MAIN_BRACKET", "同一大会にMAINブラケットを2つ作成できません")
	ErrTournamentHasScores        = errors.NewError("TOURNAMENT_HAS_SCORES", "試合にスコアが入っているためカスタマイズできません")
	ErrDAGCycleDetected           = errors.NewError("DAG_CYCLE_DETECTED", "循環参照が検出されました")
	ErrInvalidSourceMatch         = errors.NewError("INVALID_SOURCE_MATCH", "source_match_idが同一大会内の試合を参照していません")
	ErrTeamCountTooSmall          = errors.NewError("TEAM_COUNT_TOO_SMALL", "チーム数は2以上である必要があります")
	ErrNotTournamentCompetition   = errors.NewError("NOT_TOURNAMENT_COMPETITION", "トーナメント型の大会ではありません")
	ErrTournamentMatchCreateOnly  = errors.NewError("TOURNAMENT_MATCH_CREATE_ONLY", "トーナメント型の大会にはcreateTournamentMatchを使用してください")
)

// --- Query ---

func (s *Tournament) Get(ctx context.Context, id string) (*db_model.Tournament, error) {
	return s.tournamentRepository.Get(ctx, s.db, id)
}

func (s *Tournament) ListByCompetitionID(ctx context.Context, competitionID string) ([]*db_model.Tournament, error) {
	return s.tournamentRepository.ListByCompetitionID(ctx, s.db, competitionID)
}

// GetTournamentsMapByIDs は DataLoader 用（ID→Tournament のバッチ取得）
func (s *Tournament) GetTournamentsMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.Tournament, error) {
	tournaments, err := s.tournamentRepository.BatchGet(ctx, s.db, ids)
	if err != nil {
		return nil, err
	}
	result := make(map[string]*db_model.Tournament)
	for _, t := range tournaments {
		result[t.ID] = t
	}
	return result, nil
}

// GetTournamentsMapByCompetitionIDs は DataLoader 用
func (s *Tournament) GetTournamentsMapByCompetitionIDs(ctx context.Context, competitionIDs []string) (map[string][]*db_model.Tournament, error) {
	result := make(map[string][]*db_model.Tournament)
	for _, cid := range competitionIDs {
		tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, s.db, cid)
		if err != nil {
			return nil, err
		}
		result[cid] = tournaments
	}
	return result, nil
}

// GetSlotsByTournamentIDs は DataLoader 用
func (s *Tournament) GetSlotsByTournamentIDs(ctx context.Context, tournamentIDs []string) (map[string][]*db_model.TournamentSlot, error) {
	slots, err := s.tournamentRepository.BatchGetByTournamentIDs(ctx, s.db, tournamentIDs)
	if err != nil {
		return nil, err
	}
	result := make(map[string][]*db_model.TournamentSlot)
	for _, slot := range slots {
		result[slot.TournamentID] = append(result[slot.TournamentID], slot)
	}
	return result, nil
}

// GetSlotsByMatchEntryIDs は DataLoader 用
func (s *Tournament) GetSlotsByMatchEntryIDs(ctx context.Context, matchEntryIDs []string) (map[string]*db_model.TournamentSlot, error) {
	slots, err := s.tournamentRepository.BatchGetByMatchEntryIDs(ctx, s.db, matchEntryIDs)
	if err != nil {
		return nil, err
	}
	result := make(map[string]*db_model.TournamentSlot)
	for _, slot := range slots {
		result[slot.MatchEntryID] = slot
	}
	return result, nil
}

// GetMatchesByTournamentIDs は DataLoader 用
func (s *Tournament) GetMatchesByTournamentIDs(ctx context.Context, tournamentIDs []string) (map[string][]*db_model.Match, error) {
	matches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, s.db, tournamentIDs)
	if err != nil {
		return nil, err
	}
	result := make(map[string][]*db_model.Match)
	// match → match_entries → tournament_slots → tournament_id の関係を解決するために
	// tournament_slots を取得してマッピングする
	if len(matches) == 0 {
		return result, nil
	}

	// match_ids を収集
	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	// match_entries を取得
	entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, matchIDs)
	if err != nil {
		return nil, err
	}

	// entry_ids を収集
	entryIDs := make([]string, len(entries))
	for i, e := range entries {
		entryIDs[i] = e.ID
	}

	// slots を取得
	slots, err := s.tournamentRepository.BatchGetByMatchEntryIDs(ctx, s.db, entryIDs)
	if err != nil {
		return nil, err
	}

	// entry_id → tournament_id のマップ
	entryToTournament := make(map[string]string)
	for _, slot := range slots {
		entryToTournament[slot.MatchEntryID] = slot.TournamentID
	}

	// entry_id → match_id のマップ
	entryToMatch := make(map[string]string)
	for _, e := range entries {
		entryToMatch[e.ID] = e.MatchID
	}

	// match_id → tournament_id（最初に見つかったもの）
	matchToTournament := make(map[string]string)
	for entryID, tournamentID := range entryToTournament {
		matchID := entryToMatch[entryID]
		if matchID != "" {
			matchToTournament[matchID] = tournamentID
		}
	}

	// match をグループ化
	matchMap := make(map[string]*db_model.Match)
	for _, m := range matches {
		matchMap[m.ID] = m
	}

	for matchID, tournamentID := range matchToTournament {
		if m, ok := matchMap[matchID]; ok {
			result[tournamentID] = append(result[tournamentID], m)
		}
	}

	return result, nil
}

// --- トランザクション対応クエリ（Competition サービスから利用） ---

// GetMainByCompetitionIDTx はトランザクション内で MAIN ブラケットを取得する。
func (s *Tournament) GetMainByCompetitionIDTx(ctx context.Context, tx *gorm.DB, competitionID string) (*db_model.Tournament, error) {
	return s.tournamentRepository.GetMainByCompetitionID(ctx, tx, competitionID)
}

// ListSeedSlotsByTournamentIDTx はトランザクション内で SEED スロットを seed_number 昇順で取得する。
func (s *Tournament) ListSeedSlotsByTournamentIDTx(ctx context.Context, tx *gorm.DB, tournamentID string) ([]*db_model.TournamentSlot, error) {
	return s.tournamentRepository.ListSeedSlotsByTournamentID(ctx, tx, tournamentID)
}

// GetSeedSlotTx はトランザクション内で指定 seed_number の SEED スロットを取得する。
func (s *Tournament) GetSeedSlotTx(ctx context.Context, tx *gorm.DB, tournamentID string, seedNumber int64) (*db_model.TournamentSlot, error) {
	return s.tournamentRepository.GetSeedSlot(ctx, tx, tournamentID, seedNumber)
}

// --- ブラケット状態導出 ---

func (s *Tournament) ComputeBracketState(ctx context.Context, txDB *gorm.DB, tournamentID string) (model.BracketState, float64, error) {
	db := txDB
	if db == nil {
		db = s.db
	}
	slots, err := s.tournamentRepository.ListByTournamentID(ctx, db, tournamentID)
	if err != nil {
		return model.BracketStateBuilding, 0, err
	}

	if len(slots) == 0 {
		return model.BracketStateBuilding, 0, nil
	}

	matches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, db, []string{tournamentID})
	if err != nil {
		return model.BracketStateBuilding, 0, err
	}

	if len(matches) == 0 {
		return model.BracketStateBuilding, 0, nil
	}

	// match_ids を収集
	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}

	// match_entries を取得
	allEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, db, matchIDs)
	if err != nil {
		return model.BracketStateBuilding, 0, err
	}

	// entry_id → entry のマップ
	entryMap := make(map[string]*db_model.MatchEntry)
	for _, e := range allEntries {
		entryMap[e.ID] = e
	}

	// SEED スロットの team_id チェック
	hasSeedWithoutTeam := false
	for _, slot := range slots {
		if slot.SourceType == "SEED" {
			entry, ok := entryMap[slot.MatchEntryID]
			if !ok || !entry.TeamID.Valid {
				hasSeedWithoutTeam = true
				break
			}
		}
	}

	// 試合ステータスチェック
	totalMatches := len(matches)
	finishedCount := 0
	hasStarted := false
	for _, m := range matches {
		if m.Status == "FINISHED" {
			finishedCount++
			hasStarted = true
		} else if m.Status == "ONGOING" {
			hasStarted = true
		}
	}

	progress := float64(0)
	if totalMatches > 0 {
		progress = float64(finishedCount) / float64(totalMatches)
	}

	if finishedCount == totalMatches {
		return model.BracketStateCompleted, progress, nil
	}
	if hasStarted {
		return model.BracketStateInProgress, progress, nil
	}
	if hasSeedWithoutTeam {
		return model.BracketStateBuilding, progress, nil
	}
	return model.BracketStateReady, progress, nil
}

// --- ブラケット自動生成 ---

func (s *Tournament) GenerateBracket(ctx context.Context, input *model.GenerateBracketInput) ([]*db_model.Tournament, error) {
	if input.TeamCount < 2 {
		return nil, ErrTeamCountTooSmall
	}

	var tournaments []*db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 大会タイプチェック
		comp, err := s.competitionRepository.Get(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if comp.Type != "TOURNAMENT" {
			return ErrNotTournamentCompetition
		}

		// 二重生成防止
		existing, err := s.tournamentRepository.ListByCompetitionID(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if len(existing) > 0 {
			return ErrBracketAlreadyExists
		}

		// placement_method
		var pmStr sql.NullString
		if input.PlacementMethod != nil {
			pmStr = sql.NullString{Valid: true, String: input.PlacementMethod.String()}
		} else {
			pmStr = sql.NullString{Valid: true, String: "SEED_OPTIMIZED"}
		}

		// MAIN ブラケット作成
		mainTournament := &db_model.Tournament{
			ID:              ulid.Make(),
			CompetitionID:   input.CompetitionID,
			Name:            "メイン",
			BracketType:     "MAIN",
			PlacementMethod: pmStr,
			DisplayOrder:    1,
		}
		mainTournament, err = s.tournamentRepository.Save(ctx, tx, mainTournament)
		if err != nil {
			return errors.ErrSaveTournament
		}

		// ブラケット構造を生成
		matchInfos, err := s.generateMainBracketMatches(ctx, tx, mainTournament, input.TeamCount, input.CompetitionID)
		if err != nil {
			return err
		}

		tournaments = append(tournaments, mainTournament)

		// 3位決定戦
		if input.HasThirdPlaceMatch != nil && *input.HasThirdPlaceMatch && input.TeamCount >= 4 {
			subTournament, err := s.generateThirdPlaceMatch(ctx, tx, input.CompetitionID, mainTournament.ID, matchInfos)
			if err != nil {
				return err
			}
			tournaments = append(tournaments, subTournament)
		}

		// 5-8位決定戦
		if input.HasFifthToEighthPlayoff != nil && *input.HasFifthToEighthPlayoff && input.TeamCount >= 8 {
			subTournament, err := s.generateFifthToEighthPlayoff(ctx, tx, input.CompetitionID, mainTournament.ID, matchInfos)
			if err != nil {
				return err
			}
			tournaments = append(tournaments, subTournament)
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return tournaments, nil
}

// matchInfo は自動生成中に試合情報を保持する内部構造体
type matchInfo struct {
	matchID  string
	round    int
	position int // ラウンド内の位置 (0-indexed)
}

// generateMainBracketMatches はMAINブラケットの試合を生成する
func (s *Tournament) generateMainBracketMatches(ctx context.Context, tx *gorm.DB, tournament *db_model.Tournament, teamCount int32, competitionID string) ([]matchInfo, error) {
	rounds := int(math.Ceil(math.Log2(float64(teamCount))))
	bracketSize := 1 << rounds // 2^rounds
	byeCount := bracketSize - int(teamCount)

	// シード配置パターンを生成（1-indexed）
	seedPositions := generateSeedPositions(bracketSize)

	// BYEシードを特定（上位シードから）
	byeSeeds := make(map[int]bool)
	for i := 0; i < byeCount; i++ {
		byeSeeds[i+1] = true // seed 1, 2, ... がBYE
	}

	// 各ラウンドの試合を作成
	// ラウンド1（1回戦）から決勝に向かって作成
	// ただし、決勝から逆算して試合間接続を設定する
	// matchMap[round][position] = matchID
	matchMap := make(map[int]map[int]string)

	// 全matchInfoを収集
	var allMatchInfos []matchInfo

	// 1回戦: seedPositions に基づいて対戦を決定
	// 各ポジションは bracketSize/2 のスロットペア
	round1Matches := bracketSize / 2
	matchMap[1] = make(map[int]string)

	// まず、各1回戦スロットのシードペアを確認
	round1Pairs := make([]slotPair, round1Matches)
	for i := 0; i < round1Matches; i++ {
		round1Pairs[i] = slotPair{
			seed1: seedPositions[i*2],
			seed2: seedPositions[i*2+1],
		}
	}

	// BYEでない1回戦の試合だけ作成
	for i := 0; i < round1Matches; i++ {
		pair := round1Pairs[i]
		s1IsBye := byeSeeds[pair.seed1]
		s2IsBye := byeSeeds[pair.seed2]

		if s1IsBye && s2IsBye {
			// 両方BYE → 試合なし（通常発生しない）
			continue
		}
		if s1IsBye || s2IsBye {
			// 片方BYE → 試合なし。BYEでない方が次ラウンドのSEEDスロットに配置
			continue
		}

		// 両方実際のチーム → 試合を作成
		match, slot1, slot2, err := s.createTournamentMatchRecord(ctx, tx, tournament.ID, competitionID)
		if err != nil {
			return nil, err
		}
		matchMap[1][i] = match.ID

		// スロット設定: 両方 SEED
		if err := s.setSlotSeed(ctx, tx, slot1, tournament.ID, int64(pair.seed1)); err != nil {
			return nil, err
		}
		if err := s.setSlotSeed(ctx, tx, slot2, tournament.ID, int64(pair.seed2)); err != nil {
			return nil, err
		}

		allMatchInfos = append(allMatchInfos, matchInfo{matchID: match.ID, round: 1, position: i})
	}

	// ラウンド2以降
	for r := 2; r <= rounds; r++ {
		matchesInRound := bracketSize / (1 << r)
		matchMap[r] = make(map[int]string)

		for pos := 0; pos < matchesInRound; pos++ {
			match, slot1, slot2, err := s.createTournamentMatchRecord(ctx, tx, tournament.ID, competitionID)
			if err != nil {
				return nil, err
			}
			matchMap[r][pos] = match.ID
			allMatchInfos = append(allMatchInfos, matchInfo{matchID: match.ID, round: r, position: pos})

			// 前ラウンドの2つの位置
			prevPos1 := pos * 2
			prevPos2 := pos*2 + 1

			// slot1: 前ラウンドの prevPos1 の勝者
			if err := s.setSlotSource(ctx, tx, slot1, tournament.ID, r, prevPos1, matchMap, round1Pairs, byeSeeds, seedPositions, bracketSize); err != nil {
				return nil, err
			}

			// slot2: 前ラウンドの prevPos2 の勝者
			if err := s.setSlotSource(ctx, tx, slot2, tournament.ID, r, prevPos2, matchMap, round1Pairs, byeSeeds, seedPositions, bracketSize); err != nil {
				return nil, err
			}
		}
	}

	return allMatchInfos, nil
}

// setSlotSource はスロットのソースを前ラウンドの結果に基づいて設定する
func (s *Tournament) setSlotSource(ctx context.Context, tx *gorm.DB, slot *db_model.TournamentSlot, tournamentID string, currentRound int, prevPos int, matchMap map[int]map[int]string, round1Pairs []slotPair, byeSeeds map[int]bool, seedPositions []int, bracketSize int) error {
	prevRound := currentRound - 1

	if prevRound == 0 {
		// currentRound == 1 はこの関数では呼ばれない
		return nil
	}

	// 前ラウンドの試合が存在するか
	prevMatchID, prevMatchExists := matchMap[prevRound][prevPos]

	if prevRound == 1 {
		// 1回戦の場合、BYEチェック
		pair := round1Pairs[prevPos]
		s1IsBye := byeSeeds[pair.seed1]
		s2IsBye := byeSeeds[pair.seed2]

		if s1IsBye || s2IsBye {
			// BYEのある組 → BYEでない方のシードを直接SEEDスロットとして配置
			nonByeSeed := pair.seed1
			if s1IsBye {
				nonByeSeed = pair.seed2
			}
			slot.SourceType = "SEED"
			slot.SourceMatchID = sql.NullString{Valid: false}
			slot.SeedNumber = sql.NullInt64{Valid: true, Int64: int64(nonByeSeed)}
			_, err := s.tournamentRepository.SaveSlot(ctx, tx, slot)
			return err
		}
	}

	if !prevMatchExists {
		// 正常なブラケット生成では到達しないコードパス。
		// BYE は round 1 で処理済みのため、round 2 以降で前の試合がない場合はデータ不整合。
		return errors.ErrUnreachableSlotSource
	}

	// 前の試合が存在 → MATCH_WINNER
	slot.SourceType = "MATCH_WINNER"
	slot.SourceMatchID = sql.NullString{Valid: true, String: prevMatchID}
	slot.SeedNumber = sql.NullInt64{Valid: false}
	_, err := s.tournamentRepository.SaveSlot(ctx, tx, slot)
	return err
}

type slotPair struct {
	seed1 int
	seed2 int
}

// setSlotSeed はスロットをSEEDタイプに設定する
func (s *Tournament) setSlotSeed(ctx context.Context, tx *gorm.DB, slot *db_model.TournamentSlot, tournamentID string, seedNumber int64) error {
	slot.SourceType = "SEED"
	slot.SourceMatchID = sql.NullString{Valid: false}
	slot.SeedNumber = sql.NullInt64{Valid: true, Int64: seedNumber}
	_, err := s.tournamentRepository.SaveSlot(ctx, tx, slot)
	return err
}

// createTournamentMatchRecord は6レコードセットを作成する
func (s *Tournament) createTournamentMatchRecord(ctx context.Context, tx *gorm.DB, tournamentID string, competitionID string) (*db_model.Match, *db_model.TournamentSlot, *db_model.TournamentSlot, error) {
	// 1. Match
	match := &db_model.Match{
		ID:            ulid.Make(),
		Time:          time.Time{},
		Status:        "STANDBY",
		CompetitionID: competitionID,
	}
	match, err := s.matchRepository.Save(ctx, tx, match)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveMatch
	}

	// 2. MatchEntries (2つ, team_id = NULL)
	entries, err := s.matchRepository.AddMatchEntries(ctx, tx, match.ID, []string{})
	if err != nil || len(entries) < 2 {
		// AddMatchEntries with empty teamIds won't create entries.
		// Need to create them manually with null team_id
		entry1ID := ulid.Make()
		entry2ID := ulid.Make()

		entry1 := &db_model.MatchEntry{
			ID:      entry1ID,
			MatchID: match.ID,
			TeamID:  sql.NullString{Valid: false},
			Score:   0,
		}
		entry2 := &db_model.MatchEntry{
			ID:      entry2ID,
			MatchID: match.ID,
			TeamID:  sql.NullString{Valid: false},
			Score:   0,
		}

		if err := tx.Save(entry1).Error; err != nil {
			return nil, nil, nil, errors.Wrap(err)
		}
		if err := tx.Save(entry2).Error; err != nil {
			return nil, nil, nil, errors.Wrap(err)
		}

		entries = []*db_model.MatchEntry{entry1, entry2}
	}

	// 3. TournamentSlots (2つ)
	slot1 := &db_model.TournamentSlot{
		ID:           ulid.Make(),
		TournamentID: tournamentID,
		MatchEntryID: entries[0].ID,
		SourceType:   "SEED", // デフォルト、後で変更される
	}
	slot1, err = s.tournamentRepository.SaveSlot(ctx, tx, slot1)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveTournamentSlot
	}

	slot2 := &db_model.TournamentSlot{
		ID:           ulid.Make(),
		TournamentID: tournamentID,
		MatchEntryID: entries[1].ID,
		SourceType:   "SEED", // デフォルト、後で変更される
	}
	slot2, err = s.tournamentRepository.SaveSlot(ctx, tx, slot2)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveTournamentSlot
	}

	// 4. Judgment
	judgment := &db_model.Judgment{
		ID:      match.ID,
		Name:    pkggorm.ToNullString(nil),
		UserID:  pkggorm.ToNullString(nil),
		TeamID:  pkggorm.ToNullString(nil),
		GroupID: pkggorm.ToNullString(nil),
	}
	if _, err := s.judgmentRepository.Save(ctx, tx, judgment); err != nil {
		return nil, nil, nil, errors.ErrSaveJudgment
	}

	return match, slot1, slot2, nil
}

// generateSeedPositions は標準的なシード配置を生成する
// bracketSize=8 の場合: [1,8,4,5,2,7,3,6]
func generateSeedPositions(bracketSize int) []int {
	if bracketSize == 2 {
		return []int{1, 2}
	}

	// 再帰的にシード配置を生成
	positions := make([]int, bracketSize)
	positions[0] = 1
	positions[1] = 2

	for size := 2; size < bracketSize; size *= 2 {
		nextSize := size * 2
		temp := make([]int, nextSize)
		for i := 0; i < size; i++ {
			temp[i*2] = positions[i]
			temp[i*2+1] = nextSize + 1 - positions[i]
		}
		positions = temp
	}

	return positions
}

// --- 3位決定戦生成 ---

func (s *Tournament) generateThirdPlaceMatch(ctx context.Context, tx *gorm.DB, competitionID string, mainTournamentID string, mainMatchInfos []matchInfo) (*db_model.Tournament, error) {
	// 準決勝の試合を特定（最後から2番目のラウンドの試合）
	semiFinalMatches := findSemiFinals(mainMatchInfos)
	if len(semiFinalMatches) < 2 {
		return nil, nil // 準決勝が2試合未満なら3位決定戦不要
	}

	subTournament := &db_model.Tournament{
		ID:              ulid.Make(),
		CompetitionID:   competitionID,
		Name:            "3位決定戦",
		BracketType:     "SUB",
		PlacementMethod: sql.NullString{Valid: false},
		DisplayOrder:    2,
	}
	subTournament, err := s.tournamentRepository.Save(ctx, tx, subTournament)
	if err != nil {
		return nil, errors.ErrSaveTournament
	}

	// 3位決定戦: 準決勝の敗者同士
	match, slot1, slot2, err := s.createTournamentMatchRecord(ctx, tx, subTournament.ID, competitionID)
	if err != nil {
		return nil, err
	}
	_ = match

	// slot1: 準決勝1の敗者
	slot1.SourceType = "MATCH_LOSER"
	slot1.SourceMatchID = sql.NullString{Valid: true, String: semiFinalMatches[0].matchID}
	slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, slot1); err != nil {
		return nil, err
	}

	// slot2: 準決勝2の敗者
	slot2.SourceType = "MATCH_LOSER"
	slot2.SourceMatchID = sql.NullString{Valid: true, String: semiFinalMatches[1].matchID}
	slot2.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, slot2); err != nil {
		return nil, err
	}

	return subTournament, nil
}

// --- 5-8位決定戦生成 ---

func (s *Tournament) generateFifthToEighthPlayoff(ctx context.Context, tx *gorm.DB, competitionID string, mainTournamentID string, mainMatchInfos []matchInfo) (*db_model.Tournament, error) {
	// 準々決勝の試合を特定
	quarterFinalMatches := findQuarterFinals(mainMatchInfos)
	if len(quarterFinalMatches) < 4 {
		return nil, nil
	}

	subTournament := &db_model.Tournament{
		ID:              ulid.Make(),
		CompetitionID:   competitionID,
		Name:            "5-8位決定戦",
		BracketType:     "SUB",
		PlacementMethod: sql.NullString{Valid: false},
		DisplayOrder:    3,
	}
	subTournament, err := s.tournamentRepository.Save(ctx, tx, subTournament)
	if err != nil {
		return nil, errors.ErrSaveTournament
	}

	// 準決勝1: QF1敗者 vs QF2敗者
	sf1, sf1Slot1, sf1Slot2, err := s.createTournamentMatchRecord(ctx, tx, subTournament.ID, competitionID)
	if err != nil {
		return nil, err
	}
	sf1Slot1.SourceType = "MATCH_LOSER"
	sf1Slot1.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[0].matchID}
	sf1Slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf1Slot1); err != nil {
		return nil, err
	}
	sf1Slot2.SourceType = "MATCH_LOSER"
	sf1Slot2.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[1].matchID}
	sf1Slot2.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf1Slot2); err != nil {
		return nil, err
	}

	// 準決勝2: QF3敗者 vs QF4敗者
	sf2, sf2Slot1, sf2Slot2, err := s.createTournamentMatchRecord(ctx, tx, subTournament.ID, competitionID)
	if err != nil {
		return nil, err
	}
	sf2Slot1.SourceType = "MATCH_LOSER"
	sf2Slot1.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[2].matchID}
	sf2Slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf2Slot1); err != nil {
		return nil, err
	}
	sf2Slot2.SourceType = "MATCH_LOSER"
	sf2Slot2.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[3].matchID}
	sf2Slot2.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf2Slot2); err != nil {
		return nil, err
	}

	// 決勝(5-6位決定戦): sf1勝者 vs sf2勝者
	_, finalSlot1, finalSlot2, err := s.createTournamentMatchRecord(ctx, tx, subTournament.ID, competitionID)
	if err != nil {
		return nil, err
	}
	finalSlot1.SourceType = "MATCH_WINNER"
	finalSlot1.SourceMatchID = sql.NullString{Valid: true, String: sf1.ID}
	finalSlot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, finalSlot1); err != nil {
		return nil, err
	}
	finalSlot2.SourceType = "MATCH_WINNER"
	finalSlot2.SourceMatchID = sql.NullString{Valid: true, String: sf2.ID}
	finalSlot2.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, finalSlot2); err != nil {
		return nil, err
	}

	return subTournament, nil
}

// findSemiFinals はメインブラケットの準決勝試合を特定する
func findSemiFinals(matchInfos []matchInfo) []matchInfo {
	if len(matchInfos) == 0 {
		return nil
	}
	maxRound := 0
	for _, mi := range matchInfos {
		if mi.round > maxRound {
			maxRound = mi.round
		}
	}
	// 準決勝 = 決勝の1つ前のラウンド
	sfRound := maxRound - 1
	if sfRound < 1 {
		return nil
	}
	var semis []matchInfo
	for _, mi := range matchInfos {
		if mi.round == sfRound {
			semis = append(semis, mi)
		}
	}
	return semis
}

// findQuarterFinals はメインブラケットの準々決勝試合を特定する
func findQuarterFinals(matchInfos []matchInfo) []matchInfo {
	if len(matchInfos) == 0 {
		return nil
	}
	maxRound := 0
	for _, mi := range matchInfos {
		if mi.round > maxRound {
			maxRound = mi.round
		}
	}
	// 準々決勝 = 決勝の2つ前のラウンド
	qfRound := maxRound - 2
	if qfRound < 1 {
		return nil
	}
	var quarters []matchInfo
	for _, mi := range matchInfos {
		if mi.round == qfRound {
			quarters = append(quarters, mi)
		}
	}
	return quarters
}

// --- CRUD ---

func (s *Tournament) CreateTournament(ctx context.Context, input *model.CreateTournamentInput) (*db_model.Tournament, error) {
	var tournament *db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 大会タイプチェック
		comp, err := s.competitionRepository.Get(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if comp.Type != "TOURNAMENT" {
			return ErrNotTournamentCompetition
		}

		// MAIN重複チェック
		if input.BracketType == model.BracketTypeMain {
			_, err := s.tournamentRepository.GetMainByCompetitionID(ctx, tx, input.CompetitionID)
			if err == nil {
				return ErrDuplicateMainBracket
			}
		}

		var pm sql.NullString
		if input.PlacementMethod != nil {
			pm = sql.NullString{Valid: true, String: input.PlacementMethod.String()}
		}

		displayOrder := int(1)
		if input.DisplayOrder != nil {
			displayOrder = int(*input.DisplayOrder)
		}

		tournament = &db_model.Tournament{
			ID:              ulid.Make(),
			CompetitionID:   input.CompetitionID,
			Name:            input.Name,
			BracketType:     input.BracketType.String(),
			PlacementMethod: pm,
			DisplayOrder:    displayOrder,
		}

		tournament, err = s.tournamentRepository.Save(ctx, tx, tournament)
		if err != nil {
			return errors.ErrSaveTournament
		}
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return tournament, nil
}

func (s *Tournament) DeleteTournament(ctx context.Context, id string) (*db_model.Tournament, error) {
	var tournament *db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		t, err := s.tournamentRepository.Get(ctx, tx, id)
		if err != nil {
			return err
		}

		if t.BracketType == "MAIN" {
			return ErrMainBracketDeleteForbidden
		}

		// 所属する試合の match_ids を収集
		slots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, id)
		if err != nil {
			return err
		}

		matchIDs := collectMatchIDsFromSlots(ctx, tx, s.matchRepository, slots)

		// tournament を削除（slots は CASCADE）
		t, err = s.tournamentRepository.Delete(ctx, tx, id)
		if err != nil {
			return err
		}
		tournament = t

		// matches を削除
		for _, matchID := range matchIDs {
			if _, err := s.matchRepository.Delete(ctx, tx, matchID); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return tournament, nil
}

// --- CreateTournamentMatch ---

func (s *Tournament) CreateTournamentMatch(ctx context.Context, input *model.CreateTournamentMatchInput) (*db_model.Match, error) {
	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// トーナメント取得
		t, err := s.tournamentRepository.Get(ctx, tx, input.TournamentID)
		if err != nil {
			return err
		}

		// スコアチェック
		if err := s.checkNoScores(ctx, tx, t.ID); err != nil {
			return err
		}
		// READY状態ならSEEDスロットのteam_idをクリア
		if err := s.clearSeedTeamsIfReady(ctx, tx, t.ID); err != nil {
			return err
		}

		// 試合時間
		matchTime := time.Time{}
		if input.Time != nil {
			parsed, err := time.Parse(time.RFC3339, *input.Time)
			if err != nil {
				return errors.Wrap(err)
			}
			matchTime = parsed
		}

		// Match 作成
		m := &db_model.Match{
			ID:            ulid.Make(),
			Time:          matchTime,
			Status:        "STANDBY",
			CompetitionID: t.CompetitionID,
		}
		m, err = s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		// MatchEntries (2つ)
		entry1 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: m.ID, TeamID: sql.NullString{Valid: false}, Score: 0}
		entry2 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: m.ID, TeamID: sql.NullString{Valid: false}, Score: 0}
		if err := tx.Save(entry1).Error; err != nil {
			return errors.Wrap(err)
		}
		if err := tx.Save(entry2).Error; err != nil {
			return errors.Wrap(err)
		}

		// TournamentSlots
		slot1 := &db_model.TournamentSlot{
			ID:            ulid.Make(),
			TournamentID:  input.TournamentID,
			MatchEntryID:  entry1.ID,
			SourceType:    input.Slot1.SourceType.String(),
			SourceMatchID: toNullString(input.Slot1.SourceMatchID),
			SeedNumber:    toNullInt64(input.Slot1.SeedNumber),
		}
		if _, err := s.tournamentRepository.SaveSlot(ctx, tx, slot1); err != nil {
			return errors.ErrSaveTournamentSlot
		}

		slot2 := &db_model.TournamentSlot{
			ID:            ulid.Make(),
			TournamentID:  input.TournamentID,
			MatchEntryID:  entry2.ID,
			SourceType:    input.Slot2.SourceType.String(),
			SourceMatchID: toNullString(input.Slot2.SourceMatchID),
			SeedNumber:    toNullInt64(input.Slot2.SeedNumber),
		}
		if _, err := s.tournamentRepository.SaveSlot(ctx, tx, slot2); err != nil {
			return errors.ErrSaveTournamentSlot
		}

		// source_match_id のバリデーション
		if err := s.validateSourceMatch(ctx, tx, slot1, t.CompetitionID); err != nil {
			return err
		}
		if err := s.validateSourceMatch(ctx, tx, slot2, t.CompetitionID); err != nil {
			return err
		}

		// Judgment
		judgment := &db_model.Judgment{
			ID:      m.ID,
			Name:    pkggorm.ToNullString(nil),
			UserID:  pkggorm.ToNullString(nil),
			TeamID:  pkggorm.ToNullString(nil),
			GroupID: pkggorm.ToNullString(nil),
		}
		if input.Judgment != nil {
			j := input.Judgment
			if j.Name != nil {
				judgment.Name = pkggorm.ToNullString(j.Name)
			}
			if j.UserID != nil {
				judgment.UserID = pkggorm.ToNullString(j.UserID)
			}
			if j.TeamID != nil {
				judgment.TeamID = pkggorm.ToNullString(j.TeamID)
			}
			if j.GroupID != nil {
				judgment.GroupID = pkggorm.ToNullString(j.GroupID)
			}
		}
		if _, err := s.judgmentRepository.Save(ctx, tx, judgment); err != nil {
			return errors.ErrSaveJudgment
		}

		// ブラケット構造の整合性検証
		if err := s.ValidateBracketStructure(ctx, tx, input.TournamentID); err != nil {
			return err
		}

		match = m
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

// --- DeleteTournamentMatch ---

func (s *Tournament) DeleteTournamentMatch(ctx context.Context, matchID string) (*db_model.Match, error) {
	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		m, err := s.matchRepository.Get(ctx, tx, matchID)
		if err != nil {
			return err
		}

		// 所属トーナメントを特定してスコアチェック + READY時クリア
		entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, []string{matchID})
		if err != nil {
			return err
		}
		var tournamentID string
		if len(entries) > 0 {
			slot, slotErr := s.tournamentRepository.GetByMatchEntryID(ctx, tx, entries[0].ID)
			if slotErr == nil {
				tournamentID = slot.TournamentID
				if err := s.checkNoScores(ctx, tx, slot.TournamentID); err != nil {
					return err
				}
				if err := s.clearSeedTeamsIfReady(ctx, tx, slot.TournamentID); err != nil {
					return err
				}
			}
		}

		// source_match_id で参照されていないか確認
		refSlots, err := s.tournamentRepository.ListBySourceMatchID(ctx, tx, matchID)
		if err != nil {
			return err
		}
		if len(refSlots) > 0 {
			return errors.NewError("MATCH_REFERENCED", "他のスロットから参照されている試合は削除できません。先にスロット接続を解除してください")
		}

		// match の entries に紐づく slots を削除
		for _, entry := range entries {
			slot, err := s.tournamentRepository.GetByMatchEntryID(ctx, tx, entry.ID)
			if err != nil {
				continue // slot がない場合はスキップ
			}
			if _, err := s.tournamentRepository.DeleteSlot(ctx, tx, slot.ID); err != nil {
				return err
			}
		}

		// match 削除（entries は CASCADE）
		m, err = s.matchRepository.Delete(ctx, tx, matchID)
		if err != nil {
			return err
		}

		// ブラケット構造の整合性検証（試合が残っている場合のみ）
		if tournamentID != "" {
			remainingSlots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, tournamentID)
			if err != nil {
				return err
			}
			if len(remainingSlots) > 0 {
				if err := s.ValidateBracketStructure(ctx, tx, tournamentID); err != nil {
					return err
				}
			}
		}

		match = m
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

// --- UpdateSlotConnection ---

func (s *Tournament) UpdateSlotConnection(ctx context.Context, input *model.UpdateSlotConnectionInput) (*db_model.TournamentSlot, error) {
	var slot *db_model.TournamentSlot

	err := s.db.Transaction(func(tx *gorm.DB) error {
		sl, err := s.tournamentRepository.GetSlot(ctx, tx, input.SlotID)
		if err != nil {
			return err
		}

		// トーナメントのスコアチェック
		if err := s.checkNoScores(ctx, tx, sl.TournamentID); err != nil {
			return err
		}
		// READY状態ならSEEDスロットのteam_idをクリア
		if err := s.clearSeedTeamsIfReady(ctx, tx, sl.TournamentID); err != nil {
			return err
		}

		sl.SourceType = input.SourceType.String()
		sl.SourceMatchID = toNullString(input.SourceMatchID)
		sl.SeedNumber = toNullInt64(input.SeedNumber)

		// バリデーション
		tournament, err := s.tournamentRepository.Get(ctx, tx, sl.TournamentID)
		if err != nil {
			return err
		}
		if err := s.validateSourceMatch(ctx, tx, sl, tournament.CompetitionID); err != nil {
			return err
		}

		sl, err = s.tournamentRepository.SaveSlot(ctx, tx, sl)
		if err != nil {
			return errors.ErrSaveTournamentSlot
		}

		// ブラケット構造の整合性検証
		if err := s.ValidateBracketStructure(ctx, tx, sl.TournamentID); err != nil {
			return err
		}

		slot = sl
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return slot, nil
}

// --- UpdateSeedNumbers ---

func (s *Tournament) UpdateSeedNumbers(ctx context.Context, tournamentID string, seeds []*model.SeedNumberInput) ([]*db_model.TournamentSlot, error) {
	var result []*db_model.TournamentSlot

	err := s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.checkNoScores(ctx, tx, tournamentID); err != nil {
			return err
		}
		// READY状態ならSEEDスロットのteam_idをクリア
		if err := s.clearSeedTeamsIfReady(ctx, tx, tournamentID); err != nil {
			return err
		}

		for _, seed := range seeds {
			slot, err := s.tournamentRepository.GetSlot(ctx, tx, seed.SlotID)
			if err != nil {
				return err
			}
			slot.SeedNumber = sql.NullInt64{Valid: true, Int64: int64(seed.SeedNumber)}
			slot, err = s.tournamentRepository.SaveSlot(ctx, tx, slot)
			if err != nil {
				return errors.ErrSaveTournamentSlot
			}
			result = append(result, slot)
		}
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return result, nil
}

// --- AssignSeedTeam ---

// AssignSeedTeam はSEEDスロットに手動でチームを配置する。teamID が nil の場合はクリア。
func (s *Tournament) AssignSeedTeam(ctx context.Context, input *model.AssignSeedTeamInput) (*db_model.TournamentSlot, error) {
	var result *db_model.TournamentSlot

	err := s.db.Transaction(func(tx *gorm.DB) error {
		slot, err := s.tournamentRepository.GetSlot(ctx, tx, input.SlotID)
		if err != nil {
			return errors.Wrap(err)
		}

		// SEEDスロットのみ操作可能
		if slot.SourceType != "SEED" {
			return errors.ErrPromotionRuleInvalid
		}

		// スコア入力済みの試合がないかチェック
		tournament, err := s.tournamentRepository.Get(ctx, tx, slot.TournamentID)
		if err != nil {
			return errors.Wrap(err)
		}
		if err := s.checkNoScores(ctx, tx, tournament.ID); err != nil {
			return err
		}

		if input.TeamID != nil {
			// チーム配置
			if err := s.matchRepository.UpdateMatchEntryTeamID(ctx, tx, slot.MatchEntryID, *input.TeamID); err != nil {
				return errors.Wrap(err)
			}
		} else {
			// クリア
			if err := s.matchRepository.ClearMatchEntryTeamID(ctx, tx, slot.MatchEntryID); err != nil {
				return errors.Wrap(err)
			}
		}

		result, err = s.tournamentRepository.GetSlot(ctx, tx, input.SlotID)
		if err != nil {
			return errors.Wrap(err)
		}
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return result, nil
}

// --- ResetTournamentBrackets ---

func (s *Tournament) ResetTournamentBrackets(ctx context.Context, competitionID string) (*db_model.Competition, error) {
	var comp *db_model.Competition

	err := s.db.Transaction(func(tx *gorm.DB) error {
		c, err := s.competitionRepository.Get(ctx, tx, competitionID)
		if err != nil {
			return err
		}
		comp = c

		tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, tx, competitionID)
		if err != nil {
			return err
		}

		// 全ブラケットの全スロットから match_ids を収集
		var allMatchIDs []string
		matchIDSet := make(map[string]bool)

		for _, t := range tournaments {
			slots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, t.ID)
			if err != nil {
				return err
			}
			ids := collectMatchIDsFromSlots(ctx, tx, s.matchRepository, slots)
			for _, id := range ids {
				if !matchIDSet[id] {
					matchIDSet[id] = true
					allMatchIDs = append(allMatchIDs, id)
				}
			}
		}

		// 1. 全 tournaments を削除（slots が CASCADE）
		for _, t := range tournaments {
			if _, err := s.tournamentRepository.Delete(ctx, tx, t.ID); err != nil {
				return err
			}
		}

		// 2. matches を削除
		for _, matchID := range allMatchIDs {
			if _, err := s.matchRepository.Delete(ctx, tx, matchID); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return comp, nil
}

// --- バリデーション ---

// ValidateBracketStructure はブラケット構造の整合性を検証する。
// 1. 各試合に tournament_slots が正確に2つ存在すること
// 2. ブラケット内に最終試合（MATCH_WINNER で後続されない試合）が正確に1つ存在すること
func (s *Tournament) ValidateBracketStructure(ctx context.Context, tx *gorm.DB, tournamentID string) error {
	slots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, tournamentID)
	if err != nil {
		return err
	}
	if len(slots) == 0 {
		return nil // スロットなし = まだ試合がない
	}

	// ブラケット内の全試合を取得
	matches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, tx, []string{tournamentID})
	if err != nil {
		return err
	}
	if len(matches) == 0 {
		return nil
	}

	// 全試合の match_entry を一括取得
	matchIDs := make([]string, len(matches))
	for i, m := range matches {
		matchIDs[i] = m.ID
	}
	allEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
	if err != nil {
		return err
	}

	// entry_id → match_id マップ
	entryToMatch := make(map[string]string)
	for _, e := range allEntries {
		entryToMatch[e.ID] = e.MatchID
	}

	// match_id ごとにスロット数をカウント
	slotCountByMatch := make(map[string]int)
	for _, sl := range slots {
		matchID := entryToMatch[sl.MatchEntryID]
		if matchID != "" {
			slotCountByMatch[matchID]++
		}
	}

	// V-1: 各試合のスロット数 = 2 を検証
	for _, count := range slotCountByMatch {
		if count != 2 {
			return errors.ErrInvalidSlotCount
		}
	}

	// V-2: 最終試合の一意性検証
	// MATCH_WINNER で参照されている試合 = 後続がある試合
	sourcedMatches := make(map[string]bool)
	for _, sl := range slots {
		if sl.SourceType == "MATCH_WINNER" && sl.SourceMatchID.Valid {
			sourcedMatches[sl.SourceMatchID.String] = true
		}
	}

	finalCount := 0
	for matchID := range slotCountByMatch {
		if !sourcedMatches[matchID] {
			finalCount++
		}
	}
	if finalCount != 1 {
		return errors.ErrMultipleFinalMatches
	}

	return nil
}

// validateSourceMatch はスロットの source_match_id が同一competition内の試合を参照しているか検証する
func (s *Tournament) validateSourceMatch(ctx context.Context, tx *gorm.DB, slot *db_model.TournamentSlot, competitionID string) error {
	if !slot.SourceMatchID.Valid {
		return nil
	}
	match, err := s.matchRepository.Get(ctx, tx, slot.SourceMatchID.String)
	if err != nil {
		return err
	}
	if match.CompetitionID != competitionID {
		return ErrInvalidSourceMatch
	}
	return nil
}

// checkNoScores はブラケット内の試合にスコアが入っていないことを確認する
func (s *Tournament) checkNoScores(ctx context.Context, tx *gorm.DB, tournamentID string) error {
	matches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, tx, []string{tournamentID})
	if err != nil {
		return err
	}
	for _, m := range matches {
		if m.Status == "ONGOING" || m.Status == "FINISHED" {
			return ErrTournamentHasScores
		}
	}
	return nil
}

// clearSeedTeamsIfReady は、ブラケットが READY 状態の場合にSEEDスロットの match_entries.team_id を NULL にクリアする。
// カスタマイズ操作前に checkNoScores と合わせて呼び出す。
// AC: 「準備完了」状態でカスタマイズする場合、SEEDスロットの match_entries.team_id がクリアされてからカスタマイズが実行される
func (s *Tournament) clearSeedTeamsIfReady(ctx context.Context, tx *gorm.DB, tournamentID string) error {
	slots, err := s.tournamentRepository.ListSeedSlotsByTournamentID(ctx, tx, tournamentID)
	if err != nil {
		return err
	}
	if len(slots) == 0 {
		return nil
	}

	// READY判定: 全SEEDスロットの match_entry に team_id があるかチェック
	allSeedsFilled := true
	for _, slot := range slots {
		entry, err := s.matchRepository.GetMatchEntryByID(ctx, tx, slot.MatchEntryID)
		if err != nil {
			return err
		}
		if !entry.TeamID.Valid {
			allSeedsFilled = false
			break
		}
	}

	if !allSeedsFilled {
		return nil // BUILDING 状態 → クリア不要
	}

	// 全試合が STANDBY かは checkNoScores で既に確認済み → READY 状態確定
	// SEEDスロットの match_entries.team_id をクリア
	for _, slot := range slots {
		if err := s.matchRepository.ClearMatchEntryTeamID(ctx, tx, slot.MatchEntryID); err != nil {
			return err
		}
	}

	return nil
}

// ValidateDAG はブラケット内の循環参照を検出する
func (s *Tournament) ValidateDAG(ctx context.Context, competitionID string) error {
	tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, s.db, competitionID)
	if err != nil {
		return err
	}

	// 全スロットを取得
	var allSlots []*db_model.TournamentSlot
	for _, t := range tournaments {
		slots, err := s.tournamentRepository.ListByTournamentID(ctx, s.db, t.ID)
		if err != nil {
			return err
		}
		allSlots = append(allSlots, slots...)
	}

	// entry_id → match_id のマップを構築
	entryIDs := make([]string, len(allSlots))
	for i, sl := range allSlots {
		entryIDs[i] = sl.MatchEntryID
	}

	// match_entries を取得して entry_id → match_id を構築
	var allMatchIDs []string
	matchIDSet := make(map[string]bool)
	for _, t := range tournaments {
		matches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, s.db, []string{t.ID})
		if err != nil {
			return err
		}
		for _, m := range matches {
			if !matchIDSet[m.ID] {
				matchIDSet[m.ID] = true
				allMatchIDs = append(allMatchIDs, m.ID)
			}
		}
	}

	// source_match_id からグラフを構築
	// edges: source_match_id -> 所属するmatch_id
	// slotのmatch_entry_idからmatch_idを逆引き
	if len(allMatchIDs) == 0 {
		return nil
	}

	allEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, allMatchIDs)
	if err != nil {
		return err
	}
	entryToMatch := make(map[string]string)
	for _, e := range allEntries {
		entryToMatch[e.ID] = e.MatchID
	}

	// graph: source_match_id → [target_match_ids] (source_match_id の試合結果を待つ試合)
	graph := make(map[string][]string)
	for _, sl := range allSlots {
		if sl.SourceMatchID.Valid {
			targetMatchID := entryToMatch[sl.MatchEntryID]
			if targetMatchID != "" {
				graph[sl.SourceMatchID.String] = append(graph[sl.SourceMatchID.String], targetMatchID)
			}
		}
	}

	// DFS で循環検出
	visited := make(map[string]int) // 0: unvisited, 1: visiting, 2: visited
	var hasCycle bool
	var dfs func(node string)
	dfs = func(node string) {
		if hasCycle {
			return
		}
		visited[node] = 1
		for _, next := range graph[node] {
			switch visited[next] {
			case 1:
				hasCycle = true
				return
			case 0:
				dfs(next)
			}
		}
		visited[node] = 2
	}

	for _, matchID := range allMatchIDs {
		if visited[matchID] == 0 {
			dfs(matchID)
		}
	}

	if hasCycle {
		return ErrDAGCycleDetected
	}
	return nil
}

// CheckTournamentCompetition はcompetitionがトーナメント型かチェックし、そうであればエラーを返す（createMatch ガード用）
func (s *Tournament) CheckTournamentCompetition(ctx context.Context, competitionID string) error {
	comp, err := s.competitionRepository.Get(ctx, s.db, competitionID)
	if err != nil {
		return nil // competition が見つからない場合は他のバリデーションに任せる
	}
	if comp.Type == "TOURNAMENT" {
		return ErrTournamentMatchCreateOnly
	}
	return nil
}

// --- ヘルパー ---

func collectMatchIDsFromSlots(ctx context.Context, tx *gorm.DB, matchRepo repository.Match, slots []*db_model.TournamentSlot) []string {
	if len(slots) == 0 {
		return nil
	}

	entryIDs := make([]string, len(slots))
	for i, sl := range slots {
		entryIDs[i] = sl.MatchEntryID
	}

	// match_entries からmatch_idを取得
	matchIDSet := make(map[string]bool)
	var matchIDs []string

	// entry_id → match を辿るために match_entries テーブルを直接クエリ
	var entries []*db_model.MatchEntry
	tx.Where("id IN ?", entryIDs).Find(&entries)

	for _, e := range entries {
		if !matchIDSet[e.MatchID] {
			matchIDSet[e.MatchID] = true
			matchIDs = append(matchIDs, e.MatchID)
		}
	}
	return matchIDs
}

// GetMatchEntry は match_entry_id から MatchEntry を取得する
func (s *Tournament) GetMatchEntry(ctx context.Context, matchEntryID string) (*db_model.MatchEntry, error) {
	return s.matchRepository.GetMatchEntryByID(ctx, s.db, matchEntryID)
}

func toNullString(ptr *string) sql.NullString {
	if ptr == nil {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{Valid: true, String: *ptr}
}

func toNullInt64(ptr *int32) sql.NullInt64 {
	if ptr == nil {
		return sql.NullInt64{Valid: false}
	}
	return sql.NullInt64{Valid: true, Int64: int64(*ptr)}
}

// --- 自動進行 ---

// ProgressMatch は試合完了時に後続スロットへ勝者/敗者を自動配置する。
// 1トランザクション内で呼ばれることを前提とする。
func (s *Tournament) ProgressMatch(ctx context.Context, tx *gorm.DB, matchID string, winnerTeamID string) error {
	// 1. 敗者を導出: match_entries から winner でない側
	entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, []string{matchID})
	if err != nil {
		return err
	}

	var loserTeamID string
	for _, e := range entries {
		if e.TeamID.Valid && e.TeamID.String != winnerTeamID {
			loserTeamID = e.TeamID.String
			break
		}
	}

	// 2. source_match_id = matchID の tournament_slots を検索（ブラケット間含む）
	slots, err := s.tournamentRepository.ListBySourceMatchID(ctx, tx, matchID)
	if err != nil {
		return err
	}

	// 3. 各スロットの source_type に応じてチームを配置（楽観的ロック）
	for _, slot := range slots {
		var teamID string
		switch slot.SourceType {
		case "MATCH_WINNER":
			teamID = winnerTeamID
		case "MATCH_LOSER":
			teamID = loserTeamID
		default:
			continue
		}

		if teamID == "" {
			continue
		}

		if err := s.matchRepository.UpdateMatchEntryTeamIDOptimistic(ctx, tx, slot.MatchEntryID, teamID); err != nil {
			return err
		}
	}

	return nil
}

// CanModifyScore はトーナメント試合のスコア修正が可能かを再帰的に判定する。
// 後続試合（ブラケット間含む）に ONGOING または FINISHED の試合があれば修正不可。
func (s *Tournament) CanModifyScore(ctx context.Context, tx *gorm.DB, matchID string) error {
	visited := make(map[string]bool)
	return s.canModifyScoreRecursive(ctx, tx, matchID, visited)
}

func (s *Tournament) canModifyScoreRecursive(ctx context.Context, tx *gorm.DB, matchID string, visited map[string]bool) error {
	if visited[matchID] {
		return nil
	}
	visited[matchID] = true

	// この試合を source_match_id で参照している全スロットを取得
	slots, err := s.tournamentRepository.ListBySourceMatchID(ctx, tx, matchID)
	if err != nil {
		return err
	}

	for _, slot := range slots {
		// スロットに紐づく match_entry の試合を取得
		entry, err := s.matchRepository.GetMatchEntryByID(ctx, tx, slot.MatchEntryID)
		if err != nil {
			return err
		}

		dependentMatch, err := s.matchRepository.Get(ctx, tx, entry.MatchID)
		if err != nil {
			return err
		}

		// 後続試合が ONGOING または FINISHED なら修正不可
		if dependentMatch.Status == "ONGOING" || dependentMatch.Status == "FINISHED" {
			return errors.ErrTournamentScoreModificationLocked
		}

		// さらにその先も再帰的にチェック
		if err := s.canModifyScoreRecursive(ctx, tx, dependentMatch.ID, visited); err != nil {
			return err
		}
	}

	return nil
}

// RollbackFromMatch はスコア修正時に後続スロットのチーム配置を再帰的にクリアする。
func (s *Tournament) RollbackFromMatch(ctx context.Context, tx *gorm.DB, matchID string) error {
	visited := make(map[string]bool)
	return s.rollbackRecursive(ctx, tx, matchID, visited)
}

// rollbackRecursive は指定された試合を起点に、再帰的にチーム配置をクリアする。
// 起点試合の winner_team_id もクリアする。呼び出し元（UpdateResult）で新しい値が再設定される前提。
// ReconstructPromotions から呼ばれる場合も、起点試合の winner_team_id クリアは安全
// （SEEDスロット起点でそのスロットが属する試合を指定するため）。
func (s *Tournament) rollbackRecursive(ctx context.Context, tx *gorm.DB, matchID string, visited map[string]bool) error {
	if visited[matchID] {
		return nil
	}
	visited[matchID] = true

	// この試合の winner_team_id をクリア（起点試合を含む）
	m, err := s.matchRepository.Get(ctx, tx, matchID)
	if err != nil {
		return err
	}
	if m.WinnerTeamID.Valid {
		m.WinnerTeamID = sql.NullString{Valid: false}
		if _, err := s.matchRepository.Save(ctx, tx, m); err != nil {
			return err
		}
	}

	// この試合を参照する全スロットの match_entry.team_id をクリア
	slots, err := s.tournamentRepository.ListBySourceMatchID(ctx, tx, matchID)
	if err != nil {
		return err
	}

	for _, slot := range slots {
		if err := s.matchRepository.ClearMatchEntryTeamID(ctx, tx, slot.MatchEntryID); err != nil {
			return err
		}

		// 後続の試合も再帰的にクリア
		entry, err := s.matchRepository.GetMatchEntryByID(ctx, tx, slot.MatchEntryID)
		if err != nil {
			return err
		}
		if err := s.rollbackRecursive(ctx, tx, entry.MatchID, visited); err != nil {
			return err
		}
	}

	return nil
}

// ValidateNoDrawForTournament はトーナメント試合で引き分けを禁止するバリデーション。
// input の値で判定する（DB保存前に呼ぶ）。
func (s *Tournament) ValidateNoDrawForTournament(ctx context.Context, tx *gorm.DB, matchID string, inputStatus *model.MatchStatus, inputWinnerTeamID *string, inputResults []*model.MatchResultInput) error {
	// FINISHED にする場合のみチェック
	if inputStatus == nil || *inputStatus != model.MatchStatusFinished {
		return nil
	}

	// トーナメント試合かどうかの判定は呼び出し元で行うため、ここではバリデーションのみ

	// winner_team_id が指定されているか確認
	effectiveWinnerID := inputWinnerTeamID

	if effectiveWinnerID == nil || *effectiveWinnerID == "" {
		return errors.ErrTournamentWinnerRequired
	}

	// スコアが同点かチェック（inputResults が指定されている場合）
	if len(inputResults) >= 2 && effectiveWinnerID != nil {
		scores := make(map[int]int) // score → count
		for _, r := range inputResults {
			scores[int(r.Score)]++
		}
		// 全員同点で、手動 winner 指定がない場合はエラー
		// ただし管理者が winner_team_id を明示指定している場合はOK（PK戦等）
		// → winner_team_id は上で必須チェック済みなのでここでは追加チェック不要
	}

	// スコアが同点で winner_team_id が未指定の場合のバリデーション
	// inputResults が nil の場合は DB 上の既存スコアで判定
	if inputResults == nil {
		entries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, []string{matchID})
		if err != nil {
			return err
		}
		if len(entries) >= 2 {
			allSame := true
			firstScore := entries[0].Score
			for _, e := range entries[1:] {
				if e.Score != firstScore {
					allSame = false
					break
				}
			}
			if allSame && (effectiveWinnerID == nil || *effectiveWinnerID == "") {
				return errors.ErrTournamentDrawForbidden
			}
		}
	} else if len(inputResults) >= 2 {
		allSame := true
		firstScore := inputResults[0].Score
		for _, r := range inputResults[1:] {
			if r.Score != firstScore {
				allSame = false
				break
			}
		}
		if allSame && (effectiveWinnerID == nil || *effectiveWinnerID == "") {
			return errors.ErrTournamentDrawForbidden
		}
	}

	return nil
}

// DeclareForfeit は不戦勝を宣言する。FINISHED + winner 設定 → 自動進行トリガー。
func (s *Tournament) DeclareForfeit(ctx context.Context, matchID string, winnerTeamID string) (*db_model.Match, error) {
	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		m, err := s.matchRepository.Get(ctx, tx, matchID)
		if err != nil {
			return err
		}

		// トーナメント試合かチェック
		comp, err := s.competitionRepository.Get(ctx, tx, m.CompetitionID)
		if err != nil {
			return err
		}
		if comp.Type != "TOURNAMENT" {
			return ErrNotTournamentCompetition
		}

		// スコア修正制限チェック
		if err := s.CanModifyScore(ctx, tx, matchID); err != nil {
			return err
		}

		// FINISHED + winner 設定
		m.Status = "FINISHED"
		m.WinnerTeamID = sql.NullString{Valid: true, String: winnerTeamID}

		updated, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		// 自動進行
		if err := s.ProgressMatch(ctx, tx, matchID, winnerTeamID); err != nil {
			return err
		}

		// 進出トリガー: 全試合完了 or 部分完了（rank_spec確定分）
		if s.competitionService != nil {
			if err := s.competitionService.TryPromote(ctx, tx, updated.CompetitionID); err != nil {
				return err
			}
		}

		match = updated
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

// IsTournamentMatch は competition.type で判定する。
func (s *Tournament) IsTournamentMatch(ctx context.Context, tx *gorm.DB, competitionID string) (bool, error) {
	comp, err := s.competitionRepository.Get(ctx, tx, competitionID)
	if err != nil {
		return false, err
	}
	return comp.Type == "TOURNAMENT", nil
}

// --- トーナメント順位導出 ---

// ComputeTournamentRanking は competition 単位でトーナメント順位を導出する。
func (s *Tournament) ComputeTournamentRanking(ctx context.Context, competitionID string) ([]*model.TournamentRanking, error) {
	return s.computeTournamentRankingWithDB(ctx, s.db, competitionID)
}

// ComputeTournamentRankingTx はトランザクション内でトーナメント順位を導出する。
func (s *Tournament) ComputeTournamentRankingTx(ctx context.Context, tx *gorm.DB, competitionID string) ([]*model.TournamentRanking, error) {
	return s.computeTournamentRankingWithDB(ctx, tx, competitionID)
}

func (s *Tournament) computeTournamentRankingWithDB(ctx context.Context, db *gorm.DB, competitionID string) ([]*model.TournamentRanking, error) {
	// 1. 全ブラケット取得
	tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, db, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if len(tournaments) == 0 {
		return []*model.TournamentRanking{}, nil
	}

	// 2. tournament IDs 収集
	tournamentIDs := make([]string, len(tournaments))
	for i, t := range tournaments {
		tournamentIDs[i] = t.ID
	}

	// 3. 全スロット取得
	allSlots, err := s.tournamentRepository.BatchGetByTournamentIDs(ctx, db, tournamentIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	slotsByTournament := make(map[string][]*db_model.TournamentSlot)
	for _, slot := range allSlots {
		slotsByTournament[slot.TournamentID] = append(slotsByTournament[slot.TournamentID], slot)
	}

	// 4. 全試合取得
	allMatches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, db, tournamentIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// 5. match_entry 取得
	matchIDs := make([]string, len(allMatches))
	for i, m := range allMatches {
		matchIDs[i] = m.ID
	}

	var allEntries []*db_model.MatchEntry
	if len(matchIDs) > 0 {
		allEntries, err = s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, db, matchIDs)
		if err != nil {
			return nil, errors.Wrap(err)
		}
	}

	// 6. マッピング構築
	entryIDToMatchID := make(map[string]string)
	for _, e := range allEntries {
		entryIDToMatchID[e.ID] = e.MatchID
	}

	entryToTournament := make(map[string]string)
	for _, slot := range allSlots {
		entryToTournament[slot.MatchEntryID] = slot.TournamentID
	}

	matchToTournament := make(map[string]string)
	for entryID, tournamentID := range entryToTournament {
		matchID := entryIDToMatchID[entryID]
		if matchID != "" {
			matchToTournament[matchID] = tournamentID
		}
	}

	matchesByTournament := make(map[string][]*db_model.Match)
	matchMap := make(map[string]*db_model.Match)
	for _, m := range allMatches {
		matchMap[m.ID] = m
	}
	for matchID, tournamentID := range matchToTournament {
		if m, ok := matchMap[matchID]; ok {
			matchesByTournament[tournamentID] = append(matchesByTournament[tournamentID], m)
		}
	}

	entriesByMatch := make(map[string][]*db_model.MatchEntry)
	for _, e := range allEntries {
		entriesByMatch[e.MatchID] = append(entriesByMatch[e.MatchID], e)
	}

	// 7. pure function で順位計算
	return computeTournamentRanking(tournaments, slotsByTournament, matchesByTournament, entriesByMatch, entryIDToMatchID), nil
}

// --- 順位導出 pure function ---

// rankEntry は順位計算中の内部データ
type rankEntry struct {
	teamID string
	rank   int
}

// computeTournamentRanking は外部依存のない pure function としてトーナメント順位を導出する。
func computeTournamentRanking(
	tournaments []*db_model.Tournament,
	slotsByTournament map[string][]*db_model.TournamentSlot,
	matchesByTournament map[string][]*db_model.Match,
	entriesByMatch map[string][]*db_model.MatchEntry,
	entryIDToMatchID map[string]string,
) []*model.TournamentRanking {
	// MAIN ブラケットを特定
	var mainTournament *db_model.Tournament
	var subTournaments []*db_model.Tournament
	for _, t := range tournaments {
		if t.BracketType == "MAIN" {
			mainTournament = t
		} else {
			subTournaments = append(subTournaments, t)
		}
	}
	if mainTournament == nil {
		return []*model.TournamentRanking{}
	}

	mainSlots := slotsByTournament[mainTournament.ID]
	mainMatches := matchesByTournament[mainTournament.ID]
	if len(mainMatches) == 0 {
		return []*model.TournamentRanking{}
	}

	// slot.match_entry_id → match_id のマップ（全ブラケット共通）
	slotToMatchID := make(map[string]string)
	for _, slots := range slotsByTournament {
		for _, slot := range slots {
			if matchID, ok := entryIDToMatchID[slot.MatchEntryID]; ok {
				slotToMatchID[slot.MatchEntryID] = matchID
			}
		}
	}

	// MAIN ブラケットの試合グラフを構築し深さを計算
	mainMatchDepths := computeMatchDepths(mainSlots, mainMatches, slotToMatchID)

	// MAIN ブラケットから順位を導出（base_rank = 1）
	entries := computeBracketRanking(1, mainMatchDepths, mainMatches, entriesByMatch)

	// SUB ブラケットで同率順位を解消
	for _, sub := range subTournaments {
		subSlots := slotsByTournament[sub.ID]
		subMatches := matchesByTournament[sub.ID]
		if len(subMatches) == 0 {
			continue
		}

		// SUB ブラケットの base_rank を算出
		baseRank := computeSubBaseRank(subSlots, mainMatchDepths)
		if baseRank <= 0 {
			continue
		}

		// SUB ブラケット内の試合グラフから深さを計算
		subMatchDepths := computeMatchDepths(subSlots, subMatches, slotToMatchID)

		// SUB ブラケットの順位を導出
		subEntries := computeBracketRanking(baseRank, subMatchDepths, subMatches, entriesByMatch)

		// SUB で解消された順位を持つチームを MAIN の結果から除去し、SUB の結果で置き換え
		subTeamIDs := make(map[string]bool)
		for _, se := range subEntries {
			subTeamIDs[se.teamID] = true
		}
		var filtered []rankEntry
		for _, e := range entries {
			if !subTeamIDs[e.teamID] {
				filtered = append(filtered, e)
			}
		}
		entries = append(filtered, subEntries...)
	}

	// isTied の計算: 同じ rank に複数チームがいるか
	rankCounts := make(map[int]int)
	for _, e := range entries {
		rankCounts[e.rank]++
	}

	// model.TournamentRanking に変換
	result := make([]*model.TournamentRanking, len(entries))
	for i, e := range entries {
		result[i] = &model.TournamentRanking{
			Rank:   int32(e.rank),
			TeamID: e.teamID,
			IsTied: rankCounts[e.rank] > 1,
		}
	}

	// rank 昇順でソート
	sort.Slice(result, func(i, j int) bool {
		return result[i].Rank < result[j].Rank
	})

	return result
}

// computeMatchDepths は最終試合からの深さ（距離）を各試合に対して計算する。
// 最終試合 = ブラケット内で MATCH_WINNER スロットにより後続されない試合。深さ 0。
// slotToMatchID: slot.match_entry_id → match_id
func computeMatchDepths(
	slots []*db_model.TournamentSlot,
	matches []*db_model.Match,
	slotToMatchID map[string]string,
) map[string]int {
	matchIDSet := make(map[string]bool)
	for _, m := range matches {
		matchIDSet[m.ID] = true
	}

	// source_match → successor_match のグラフ構築
	// slot.source_type == MATCH_WINNER && slot.source_match_id == X
	// → X の勝者がこの slot の match に入る → X はこの slot が属する match の前の試合
	sourceToSuccessor := make(map[string]string)
	successorToSources := make(map[string][]string)

	for _, slot := range slots {
		if slot.SourceType == "MATCH_WINNER" && slot.SourceMatchID.Valid {
			sourceMatchID := slot.SourceMatchID.String
			successorMatchID := slotToMatchID[slot.MatchEntryID]
			if successorMatchID != "" && matchIDSet[sourceMatchID] {
				sourceToSuccessor[sourceMatchID] = successorMatchID
				successorToSources[successorMatchID] = append(successorToSources[successorMatchID], sourceMatchID)
			}
		}
	}

	// 最終試合 = MATCH_WINNER で後続されない試合
	var finalMatchID string
	for _, m := range matches {
		if _, hasSuccessor := sourceToSuccessor[m.ID]; !hasSuccessor {
			finalMatchID = m.ID
			break
		}
	}
	if finalMatchID == "" {
		return map[string]int{}
	}

	// BFS で最終試合（depth=0）から逆にたどって深さを計算
	depths := make(map[string]int)
	queue := []string{finalMatchID}
	depths[finalMatchID] = 0

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		currentDepth := depths[current]

		for _, source := range successorToSources[current] {
			if _, visited := depths[source]; !visited {
				depths[source] = currentDepth + 1
				queue = append(queue, source)
			}
		}
	}

	return depths
}

// computeBracketRanking は1つのブラケット内で順位を導出する。
// baseRank: このブラケットの最高順位（MAINなら1、SUBならMAINでの対応順位）
func computeBracketRanking(
	baseRank int,
	matchDepths map[string]int,
	matches []*db_model.Match,
	entriesByMatch map[string][]*db_model.MatchEntry,
) []rankEntry {
	var entries []rankEntry

	for _, m := range matches {
		if m.Status != "FINISHED" {
			continue
		}
		if !m.WinnerTeamID.Valid {
			continue
		}

		depth, ok := matchDepths[m.ID]
		if !ok {
			continue
		}

		winnerTeamID := m.WinnerTeamID.String
		loserTeamID := getLoserTeamID(m.ID, winnerTeamID, entriesByMatch)
		if loserTeamID == "" {
			continue
		}

		if depth == 0 {
			// 決勝: 勝者 = baseRank, 敗者 = baseRank + 1
			entries = append(entries, rankEntry{teamID: winnerTeamID, rank: baseRank})
			entries = append(entries, rankEntry{teamID: loserTeamID, rank: baseRank + 1})
		} else {
			// 敗者に敗退ラウンドに応じた順位を割り当て
			// 深さ D の敗者の順位 = baseRank + 2^D
			loserRank := baseRank + (1 << depth)
			entries = append(entries, rankEntry{teamID: loserTeamID, rank: loserRank})
		}
	}

	return entries
}

// getLoserTeamID は試合の敗者チームIDを返す。
func getLoserTeamID(matchID string, winnerTeamID string, entriesByMatch map[string][]*db_model.MatchEntry) string {
	for _, e := range entriesByMatch[matchID] {
		if e.TeamID.Valid && e.TeamID.String != winnerTeamID {
			return e.TeamID.String
		}
	}
	return ""
}

// computeTiedRanks はブラケット構造から「同率になりうる順位」の集合を返す。
// 進出ルール設定時のバリデーションに使用する。
func computeTiedRanks(
	tournaments []*db_model.Tournament,
	slotsByTournament map[string][]*db_model.TournamentSlot,
	matchesByTournament map[string][]*db_model.Match,
	entryIDToMatchID map[string]string,
) map[int]bool {
	var mainTournament *db_model.Tournament
	var subTournaments []*db_model.Tournament
	for _, t := range tournaments {
		if t.BracketType == "MAIN" {
			mainTournament = t
		} else {
			subTournaments = append(subTournaments, t)
		}
	}
	if mainTournament == nil {
		return map[int]bool{}
	}

	mainSlots := slotsByTournament[mainTournament.ID]
	mainMatches := matchesByTournament[mainTournament.ID]
	if len(mainMatches) == 0 {
		return map[int]bool{}
	}

	slotToMatchID := make(map[string]string)
	for _, slots := range slotsByTournament {
		for _, slot := range slots {
			if matchID, ok := entryIDToMatchID[slot.MatchEntryID]; ok {
				slotToMatchID[slot.MatchEntryID] = matchID
			}
		}
	}

	mainMatchDepths := computeMatchDepths(mainSlots, mainMatches, slotToMatchID)

	// MAINブラケットの各 depth で同率順位を特定
	// depth 0 (決勝): 1位/2位 → 同率なし
	// depth d (d>0): 順位 1 + 2^d が 2^d チーム → 同率
	maxDepth := 0
	for _, d := range mainMatchDepths {
		if d > maxDepth {
			maxDepth = d
		}
	}

	tiedRanks := make(map[int]bool)
	for d := 1; d <= maxDepth; d++ {
		startRank := 1 + (1 << d)
		count := 1 << d
		for r := startRank; r < startRank+count; r++ {
			tiedRanks[r] = true
		}
	}

	// SUBブラケットが解消するrankを除外
	// 前提: SUBブラケットはシングルエリミネーション構造であること
	// n チームの SUB では 2^(maxDepth+1) 個の一意順位が確定する
	for _, sub := range subTournaments {
		subSlots := slotsByTournament[sub.ID]
		subMatches := matchesByTournament[sub.ID]
		if len(subMatches) == 0 {
			continue
		}
		baseRank := computeSubBaseRank(subSlots, mainMatchDepths)
		if baseRank <= 0 {
			continue
		}
		// SUBブラケットの深さから解消される一意順位数を算出
		// maxDepth=0 (決勝のみ): 2^1 = 2順位（例: 3位決定戦 → 3位,4位）
		// maxDepth=1 (準決勝+決勝): 2^2 = 4順位（例: 5-8位決定戦 → 5,6,7,8位）
		subMatchDepths := computeMatchDepths(subSlots, subMatches, slotToMatchID)
		subMaxDepth := 0
		for _, d := range subMatchDepths {
			if d > subMaxDepth {
				subMaxDepth = d
			}
		}
		resolvedCount := 1 << (subMaxDepth + 1)
		for r := baseRank; r < baseRank+resolvedCount; r++ {
			delete(tiedRanks, r)
		}
	}

	return tiedRanks
}

// ValidateRankSpecForTournament は進出ルールの rank_spec がトーナメントブラケット構造上で一意に確定するかを検証する。
func (s *Tournament) ValidateRankSpecForTournament(ctx context.Context, tx *gorm.DB, competitionID string, rankSpec string) error {
	ranks, err := ParseRankSpec(rankSpec)
	if err != nil {
		return errors.ErrPromotionRuleInvalid
	}

	tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(tournaments) == 0 {
		return nil // ブラケット未生成の場合はスキップ
	}

	tournamentIDs := make([]string, len(tournaments))
	for i, t := range tournaments {
		tournamentIDs[i] = t.ID
	}

	allSlots, err := s.tournamentRepository.BatchGetByTournamentIDs(ctx, tx, tournamentIDs)
	if err != nil {
		return errors.Wrap(err)
	}
	slotsByTournament := make(map[string][]*db_model.TournamentSlot)
	for _, slot := range allSlots {
		slotsByTournament[slot.TournamentID] = append(slotsByTournament[slot.TournamentID], slot)
	}

	allMatches, err := s.matchRepository.BatchGetMatchesByTournamentIDs(ctx, tx, tournamentIDs)
	if err != nil {
		return errors.Wrap(err)
	}

	matchIDs := make([]string, len(allMatches))
	for i, m := range allMatches {
		matchIDs[i] = m.ID
	}

	var allEntries []*db_model.MatchEntry
	if len(matchIDs) > 0 {
		allEntries, err = s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, tx, matchIDs)
		if err != nil {
			return errors.Wrap(err)
		}
	}

	entryIDToMatchID := make(map[string]string)
	for _, e := range allEntries {
		entryIDToMatchID[e.ID] = e.MatchID
	}

	entryToTournament := make(map[string]string)
	for _, slot := range allSlots {
		entryToTournament[slot.MatchEntryID] = slot.TournamentID
	}

	// match→tournament を O(n) で構築（computeTournamentRankingWithDB と同じパターン）
	matchToTournament := make(map[string]string)
	for entryID, tournamentID := range entryToTournament {
		matchID := entryIDToMatchID[entryID]
		if matchID != "" {
			matchToTournament[matchID] = tournamentID
		}
	}

	matchesByTournament := make(map[string][]*db_model.Match)
	matchMap := make(map[string]*db_model.Match)
	for _, m := range allMatches {
		matchMap[m.ID] = m
	}
	for matchID, tournamentID := range matchToTournament {
		if m, ok := matchMap[matchID]; ok {
			matchesByTournament[tournamentID] = append(matchesByTournament[tournamentID], m)
		}
	}

	tiedRanks := computeTiedRanks(tournaments, slotsByTournament, matchesByTournament, entryIDToMatchID)

	for _, rank := range ranks {
		if tiedRanks[rank] {
			return errors.ErrPromotionRuleInvalid
		}
	}

	return nil
}

// computeSubBaseRank は SUB ブラケットの base_rank を算出する。
// SUB の全 MATCH_LOSER スロットが参照する MAIN 試合の深さの最小値から: base_rank = 1 + 2^minDepth
// 異なるラウンドの敗者が混在する SUB ブラケットでも、最も上位の順位から割り当てる。
func computeSubBaseRank(subSlots []*db_model.TournamentSlot, mainMatchDepths map[string]int) int {
	minDepth := -1
	for _, slot := range subSlots {
		if slot.SourceType == "MATCH_LOSER" && slot.SourceMatchID.Valid {
			if depth, ok := mainMatchDepths[slot.SourceMatchID.String]; ok {
				if minDepth == -1 || depth < minDepth {
					minDepth = depth
				}
			}
		}
	}
	if minDepth < 0 {
		return 0
	}
	return 1 + (1 << minDepth)
}
