package service

import (
	"context"
	"database/sql"
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
	matches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, s.db, tournamentIDs)
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

	matches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, db, []string{tournamentID})
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
		if slot.SourceType == string(model.SlotSourceTypeSeed) {
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
		if m.Status == string(model.MatchStatusFinished) {
			finishedCount++
			hasStarted = true
		} else if m.Status == string(model.MatchStatusOngoing) {
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
		return nil, errors.ErrTeamCountTooSmall
	}

	var tournaments []*db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 大会タイプチェック
		comp, err := s.competitionRepository.Get(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if comp.Type != string(model.CompetitionTypeTournament) {
			return errors.ErrNotTournamentCompetition
		}

		// 既存ブラケットがあればリセット
		existing, err := s.tournamentRepository.ListByCompetitionID(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if len(existing) > 0 {
			if err := s.resetBracketsInTx(ctx, tx, existing); err != nil {
				return err
			}
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
			BracketType:     string(model.BracketTypeMain),
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

		// SUBブラケット生成
		if input.SubBrackets != nil {
			for i, sub := range input.SubBrackets {
				subTournament, err := s.generateSubBracketFromSource(ctx, tx, input.CompetitionID, mainTournament.ID, matchInfos, sub, i+2)
				if err != nil {
					return err
				}
				if subTournament != nil {
					tournaments = append(tournaments, subTournament)
				}
			}
		}

		// 大会のデフォルトロケーションを全試合に設定
		if comp.DefaultLocationID.Valid {
			if err := tx.WithContext(ctx).Model(&db_model.Match{}).
				Where("competition_id = ? AND location_id IS NULL", input.CompetitionID).
				Update("location_id", comp.DefaultLocationID.String).Error; err != nil {
				return errors.Wrap(err)
			}
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
	depth    int // Finalからの距離 (0=Final, 1=準決勝, ...)
}

// --- コンパクトブラケット ツリー構造 ---

// bracketNode はブラケットツリーのノード。seedNumber > 0 ならリーフ（SEED）。
type bracketNode struct {
	seedNumber int
	child1     *bracketNode
	child2     *bracketNode
	matchID    string
	round      int
	position   int
	depth      int
}

// isPowerOf2 は n が2の冪かどうかを判定する
func isPowerOf2(n int) bool {
	return n > 0 && (n&(n-1)) == 0
}

// nextLowerPow2 は n 以下の最大の2の冪を返す
func nextLowerPow2(n int) int {
	p := 1
	for p*2 <= n {
		p *= 2
	}
	return p
}

// nextPow2 は n 以上の最小の2の冪を返す
func nextPow2(n int) int {
	p := 1
	for p < n {
		p *= 2
	}
	return p
}

// buildCompactBracket はチーム数に応じてコンパクトブラケットツリーを構築する
func buildCompactBracket(n int) *bracketNode {
	if n <= 1 {
		return &bracketNode{seedNumber: 1}
	}
	if n == 2 {
		return &bracketNode{
			child1: &bracketNode{seedNumber: 1},
			child2: &bracketNode{seedNumber: 2},
		}
	}

	if isPowerOf2(n) {
		seeds := generateSeedPositions(n)
		return buildTreeFromSeeds(seeds)
	}

	p := nextLowerPow2(n)
	prelim := n - p

	if prelim*2 == p {
		// all-play fold方式 (N = 3*2^k: 3, 6, 12, 24, ...)
		return buildAllPlayFoldTree(n)
	}
	// p-bracket + play-in方式
	return buildPlayInTree(n, p, prelim)
}

// buildTreeFromSeeds は標準シード配列からバランスの取れたツリーを構築する
func buildTreeFromSeeds(seeds []int) *bracketNode {
	if len(seeds) == 2 {
		return &bracketNode{
			child1: &bracketNode{seedNumber: seeds[0]},
			child2: &bracketNode{seedNumber: seeds[1]},
		}
	}
	mid := len(seeds) / 2
	return &bracketNode{
		child1: buildTreeFromSeeds(seeds[:mid]),
		child2: buildTreeFromSeeds(seeds[mid:]),
	}
}

// buildPlayInTree は p-bracket + play-in方式のツリーを構築する
func buildPlayInTree(n, p, prelim int) *bracketNode {
	seeds := generateSeedPositions(p)

	// play-inマップ: メインブラケットのシード → play-inノード
	playIns := make(map[int]*bracketNode)
	for i := 0; i < prelim; i++ {
		mainSeed := p - i
		extraSeed := p + 1 + i
		playIns[mainSeed] = &bracketNode{
			child1: &bracketNode{seedNumber: mainSeed},
			child2: &bracketNode{seedNumber: extraSeed},
		}
	}

	return buildTreeFromSeedsWithPlayIns(seeds, playIns)
}

// buildTreeFromSeedsWithPlayIns はplay-inを含むツリーを構築する
func buildTreeFromSeedsWithPlayIns(seeds []int, playIns map[int]*bracketNode) *bracketNode {
	if len(seeds) == 2 {
		return &bracketNode{
			child1: getLeafOrPlayIn(seeds[0], playIns),
			child2: getLeafOrPlayIn(seeds[1], playIns),
		}
	}
	mid := len(seeds) / 2
	return &bracketNode{
		child1: buildTreeFromSeedsWithPlayIns(seeds[:mid], playIns),
		child2: buildTreeFromSeedsWithPlayIns(seeds[mid:], playIns),
	}
}

func getLeafOrPlayIn(seed int, playIns map[int]*bracketNode) *bracketNode {
	if pi, ok := playIns[seed]; ok {
		return pi
	}
	return &bracketNode{seedNumber: seed}
}

// buildAllPlayFoldTree は all-play fold方式のツリーを構築する
func buildAllPlayFoldTree(n int) *bracketNode {
	halfN := n / 2
	var entries []*bracketNode

	if n%2 == 1 {
		// 奇数: seed 1がbye、残りをfoldペア
		entries = append(entries, &bracketNode{seedNumber: 1})
		for i := 0; i < halfN; i++ {
			topSeed := i + 2
			botSeed := n - i
			entries = append(entries, &bracketNode{
				child1: &bracketNode{seedNumber: topSeed},
				child2: &bracketNode{seedNumber: botSeed},
			})
		}
	} else {
		// 偶数: 全チームfoldペア
		for i := 0; i < halfN; i++ {
			topSeed := i + 1
			botSeed := n - i
			entries = append(entries, &bracketNode{
				child1: &bracketNode{seedNumber: topSeed},
				child2: &bracketNode{seedNumber: botSeed},
			})
		}
	}

	return buildBracketFromEntries(entries)
}

// buildBracketFromEntries はエントリ列（seedまたはmatchノード）からブラケットを再帰的に構築する
func buildBracketFromEntries(entries []*bracketNode) *bracketNode {
	count := len(entries)
	if count == 1 {
		return entries[0]
	}
	if count == 2 {
		return &bracketNode{child1: entries[0], child2: entries[1]}
	}

	if isPowerOf2(count) {
		order := generateSeedPositions(count)
		reordered := make([]*bracketNode, count)
		for i, pos := range order {
			reordered[i] = entries[pos-1]
		}
		return buildTreeFromEntries(reordered)
	}

	// 非2の冪: 標準シード順でtop/bottomに分割
	p := nextPow2(count)
	order := generateSeedPositions(p)
	halfP := p / 2

	var topEntries, botEntries []*bracketNode
	for idx, seedPos := range order {
		if seedPos > count {
			continue
		}
		item := entries[seedPos-1]
		if idx < halfP {
			topEntries = append(topEntries, item)
		} else {
			botEntries = append(botEntries, item)
		}
	}

	return &bracketNode{
		child1: buildBracketFromEntries(topEntries),
		child2: buildBracketFromEntries(botEntries),
	}
}

// buildTreeFromEntries は偶数個のエントリからバランスツリーを構築する
func buildTreeFromEntries(entries []*bracketNode) *bracketNode {
	if len(entries) == 2 {
		return &bracketNode{child1: entries[0], child2: entries[1]}
	}
	mid := len(entries) / 2
	return &bracketNode{
		child1: buildTreeFromEntries(entries[:mid]),
		child2: buildTreeFromEntries(entries[mid:]),
	}
}

// computeNodeRound はツリーのroundを再帰的に計算する（リーフ→0、matchノード→max(child)+1）
func computeNodeRound(node *bracketNode) int {
	if node.seedNumber > 0 {
		return -1 // リーフはマッチではない
	}
	var r1, r2 int
	if node.child1 != nil {
		r1 = computeNodeRound(node.child1)
	}
	if node.child2 != nil {
		r2 = computeNodeRound(node.child2)
	}
	node.round = max(r1, r2) + 1
	return node.round
}

// computeNodeDepth はツリーのdepthを再帰的に設定する（root=0、子=親+1）
func computeNodeDepth(node *bracketNode, d int) {
	node.depth = d
	if node.child1 != nil {
		computeNodeDepth(node.child1, d+1)
	}
	if node.child2 != nil {
		computeNodeDepth(node.child2, d+1)
	}
}

// assignNodePositions はラウンドごとの位置をDFS順で割り当てる
func assignNodePositions(node *bracketNode, counter map[int]int) {
	if node.seedNumber > 0 {
		return
	}
	if node.child1 != nil {
		assignNodePositions(node.child1, counter)
	}
	node.position = counter[node.round]
	counter[node.round]++
	if node.child2 != nil {
		assignNodePositions(node.child2, counter)
	}
}

// generateMainBracketMatches はMAINブラケットの試合を生成する（ツリーベース・バルクINSERT）
func (s *Tournament) generateMainBracketMatches(ctx context.Context, tx *gorm.DB, tournament *db_model.Tournament, teamCount int32, competitionID string) ([]matchInfo, error) {
	// ツリー構築
	root := buildCompactBracket(int(teamCount))

	// ラウンド・深さ・ポジション計算
	computeNodeRound(root)
	computeNodeDepth(root, 0)
	posCounter := make(map[int]int)
	assignNodePositions(root, posCounter)

	// ツリーからDBレコードを生成
	var allMatchInfos []matchInfo
	var allMatches []*db_model.Match
	var allEntries []*db_model.MatchEntry
	var allSlots []*db_model.TournamentSlot
	var allJudgments []*db_model.Judgment

	var createRecords func(node *bracketNode)
	createRecords = func(node *bracketNode) {
		if node.seedNumber > 0 {
			return // リーフ（SEED）はマッチを作らない
		}
		// 子を先に処理（DFS）
		createRecords(node.child1)
		createRecords(node.child2)

		// マッチレコードセット作成
		match := &db_model.Match{
			ID:            ulid.Make(),
			Time:          time.Now(),
			Status:        string(model.MatchStatusStandby),
			CompetitionID: competitionID,
		}
		entry1 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: match.ID, Score: 0}
		entry2 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: match.ID, Score: 0}
		slot1 := &db_model.TournamentSlot{ID: ulid.Make(), TournamentID: tournament.ID, MatchEntryID: entry1.ID}
		slot2 := &db_model.TournamentSlot{ID: ulid.Make(), TournamentID: tournament.ID, MatchEntryID: entry2.ID}
		judgment := &db_model.Judgment{
			ID:      match.ID,
			Name:    pkggorm.ToNullString(nil),
			UserID:  pkggorm.ToNullString(nil),
			TeamID:  pkggorm.ToNullString(nil),
			GroupID: pkggorm.ToNullString(nil),
		}

		// child1 → slot1
		setSlotFromChild(slot1, node.child1)
		// child2 → slot2
		setSlotFromChild(slot2, node.child2)

		node.matchID = match.ID

		allMatches = append(allMatches, match)
		allEntries = append(allEntries, entry1, entry2)
		allSlots = append(allSlots, slot1, slot2)
		allJudgments = append(allJudgments, judgment)
		allMatchInfos = append(allMatchInfos, matchInfo{
			matchID:  match.ID,
			round:    node.round,
			position: node.position,
			depth:    node.depth,
		})
	}
	createRecords(root)

	// バルクINSERT
	if err := s.matchRepository.SaveBatch(ctx, tx, allMatches); err != nil {
		return nil, errors.Wrap(err)
	}
	if err := s.matchRepository.SaveMatchEntriesBatch(ctx, tx, allEntries); err != nil {
		return nil, errors.Wrap(err)
	}
	if err := s.tournamentRepository.SaveSlotsBatch(ctx, tx, allSlots); err != nil {
		return nil, errors.Wrap(err)
	}
	if err := s.judgmentRepository.SaveBatch(ctx, tx, allJudgments); err != nil {
		return nil, errors.Wrap(err)
	}

	return allMatchInfos, nil
}

// setSlotFromChild はブラケットノードの子に応じてスロットのソースを設定する
func setSlotFromChild(slot *db_model.TournamentSlot, child *bracketNode) {
	if child.seedNumber > 0 {
		slot.SourceType = string(model.SlotSourceTypeSeed)
		slot.SeedNumber = sql.NullInt64{Valid: true, Int64: int64(child.seedNumber)}
		slot.SourceMatchID = sql.NullString{Valid: false}
	} else {
		slot.SourceType = string(model.SlotSourceTypeMatchWinner)
		slot.SourceMatchID = sql.NullString{Valid: true, String: child.matchID}
		slot.SeedNumber = sql.NullInt64{Valid: false}
	}
}

type slotPair struct {
	seed1 int
	seed2 int
}

// createTournamentMatchRecord は6レコードセットを作成する（AddMatch / カスタマイズ操作用）
func (s *Tournament) createTournamentMatchRecord(ctx context.Context, tx *gorm.DB, tournamentID string, competitionID string) (*db_model.Match, *db_model.TournamentSlot, *db_model.TournamentSlot, error) {
	match := &db_model.Match{
		ID:            ulid.Make(),
		Time:          time.Now(),
		Status:        string(model.MatchStatusStandby),
		CompetitionID: competitionID,
	}
	match, err := s.matchRepository.Save(ctx, tx, match)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveMatch
	}

	entry1 := &db_model.MatchEntry{
		ID:      ulid.Make(),
		MatchID: match.ID,
		TeamID:  sql.NullString{Valid: false},
		Score:   0,
	}
	entry2 := &db_model.MatchEntry{
		ID:      ulid.Make(),
		MatchID: match.ID,
		TeamID:  sql.NullString{Valid: false},
		Score:   0,
	}

	if _, err := s.matchRepository.SaveMatchEntry(ctx, tx, entry1); err != nil {
		return nil, nil, nil, errors.Wrap(err)
	}
	if _, err := s.matchRepository.SaveMatchEntry(ctx, tx, entry2); err != nil {
		return nil, nil, nil, errors.Wrap(err)
	}

	entries := []*db_model.MatchEntry{entry1, entry2}

	slot1 := &db_model.TournamentSlot{
		ID:           ulid.Make(),
		TournamentID: tournamentID,
		MatchEntryID: entries[0].ID,
		SourceType:   string(model.SlotSourceTypeSeed),
	}
	slot1, err = s.tournamentRepository.SaveSlot(ctx, tx, slot1)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveTournamentSlot
	}

	slot2 := &db_model.TournamentSlot{
		ID:           ulid.Make(),
		TournamentID: tournamentID,
		MatchEntryID: entries[1].ID,
		SourceType:   string(model.SlotSourceTypeSeed),
	}
	slot2, err = s.tournamentRepository.SaveSlot(ctx, tx, slot2)
	if err != nil {
		return nil, nil, nil, errors.ErrSaveTournamentSlot
	}

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

// --- SUBブラケット汎用生成 ---

// generateSubBracketFromSource は sourceRound（= depth: Finalからの距離）の敗者を集めてSUBブラケットを生成する。
// sourceRound は「決勝から何ラウンド前か」を表す（1 = 準決勝、2 = 準々決勝）→ depth に対応。
func (s *Tournament) generateSubBracketFromSource(ctx context.Context, tx *gorm.DB, competitionID string, mainTournamentID string, mainMatchInfos []matchInfo, sub *model.SubBracketInput, displayOrder int) (*db_model.Tournament, error) {
	targetDepth := int(sub.SourceRound)
	sourceMatches := findMatchesByDepth(mainMatchInfos, targetDepth)
	if len(sourceMatches) < 2 {
		return nil, nil
	}

	// sourceMatches が2試合の場合 → 1試合のSUBブラケット（3位決定戦パターン）
	if len(sourceMatches) == 2 {
		return s.generateThirdPlaceMatch(ctx, tx, competitionID, mainTournamentID, mainMatchInfos)
	}

	// sourceMatches が4試合の場合 → 5-8位決定戦パターン
	if len(sourceMatches) == 4 {
		return s.generateFifthToEighthPlayoff(ctx, tx, competitionID, mainTournamentID, mainMatchInfos)
	}

	// それ以外: 汎用的に敗者でトーナメントを構成
	subTournament := &db_model.Tournament{
		ID:              ulid.Make(),
		CompetitionID:   competitionID,
		Name:            sub.Name,
		BracketType:     string(model.BracketTypeSub),
		PlacementMethod: sql.NullString{Valid: false},
		DisplayOrder:    displayOrder,
	}
	subTournament, err := s.tournamentRepository.Save(ctx, tx, subTournament)
	if err != nil {
		return nil, errors.ErrSaveTournament
	}

	// ソースラウンドの敗者同士でペアを作る
	for i := 0; i+1 < len(sourceMatches); i += 2 {
		_, sl1, sl2, err := s.createTournamentMatchRecord(ctx, tx, subTournament.ID, competitionID)
		if err != nil {
			return nil, err
		}
		sl1.SourceType = string(model.SlotSourceTypeMatchLoser)
		sl1.SourceMatchID = sql.NullString{Valid: true, String: sourceMatches[i].matchID}
		sl1.SeedNumber = sql.NullInt64{Valid: false}
		if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sl1); err != nil {
			return nil, err
		}
		sl2.SourceType = string(model.SlotSourceTypeMatchLoser)
		sl2.SourceMatchID = sql.NullString{Valid: true, String: sourceMatches[i+1].matchID}
		sl2.SeedNumber = sql.NullInt64{Valid: false}
		if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sl2); err != nil {
			return nil, err
		}
	}

	return subTournament, nil
}

// findMatchesByRound は指定ラウンドの試合を position 昇順で返す
func findMatchesByRound(matchInfos []matchInfo, round int) []matchInfo {
	var result []matchInfo
	for _, mi := range matchInfos {
		if mi.round == round {
			result = append(result, mi)
		}
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].position < result[j].position
	})
	return result
}

// findMatchesByDepth は指定 depth（Finalからの距離）の試合を position 昇順で返す
func findMatchesByDepth(matchInfos []matchInfo, depth int) []matchInfo {
	var result []matchInfo
	for _, mi := range matchInfos {
		if mi.depth == depth {
			result = append(result, mi)
		}
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].position < result[j].position
	})
	return result
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
		BracketType:     string(model.BracketTypeSub),
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
	slot1.SourceType = string(model.SlotSourceTypeMatchLoser)
	slot1.SourceMatchID = sql.NullString{Valid: true, String: semiFinalMatches[0].matchID}
	slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, slot1); err != nil {
		return nil, err
	}

	// slot2: 準決勝2の敗者
	slot2.SourceType = string(model.SlotSourceTypeMatchLoser)
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
		BracketType:     string(model.BracketTypeSub),
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
	sf1Slot1.SourceType = string(model.SlotSourceTypeMatchLoser)
	sf1Slot1.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[0].matchID}
	sf1Slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf1Slot1); err != nil {
		return nil, err
	}
	sf1Slot2.SourceType = string(model.SlotSourceTypeMatchLoser)
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
	sf2Slot1.SourceType = string(model.SlotSourceTypeMatchLoser)
	sf2Slot1.SourceMatchID = sql.NullString{Valid: true, String: quarterFinalMatches[2].matchID}
	sf2Slot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, sf2Slot1); err != nil {
		return nil, err
	}
	sf2Slot2.SourceType = string(model.SlotSourceTypeMatchLoser)
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
	finalSlot1.SourceType = string(model.SlotSourceTypeMatchWinner)
	finalSlot1.SourceMatchID = sql.NullString{Valid: true, String: sf1.ID}
	finalSlot1.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, finalSlot1); err != nil {
		return nil, err
	}
	finalSlot2.SourceType = string(model.SlotSourceTypeMatchWinner)
	finalSlot2.SourceMatchID = sql.NullString{Valid: true, String: sf2.ID}
	finalSlot2.SeedNumber = sql.NullInt64{Valid: false}
	if _, err := s.tournamentRepository.SaveSlot(ctx, tx, finalSlot2); err != nil {
		return nil, err
	}

	return subTournament, nil
}

// findSemiFinals はメインブラケットの準決勝試合を特定する（depth=1: Finalの直接フィーダー）
func findSemiFinals(matchInfos []matchInfo) []matchInfo {
	var semis []matchInfo
	for _, mi := range matchInfos {
		if mi.depth == 1 {
			semis = append(semis, mi)
		}
	}
	sort.Slice(semis, func(i, j int) bool { return semis[i].position < semis[j].position })
	return semis
}

// findQuarterFinals はメインブラケットの準々決勝試合を特定する（depth=2: 準決勝のフィーダー）
func findQuarterFinals(matchInfos []matchInfo) []matchInfo {
	var quarters []matchInfo
	for _, mi := range matchInfos {
		if mi.depth == 2 {
			quarters = append(quarters, mi)
		}
	}
	sort.Slice(quarters, func(i, j int) bool { return quarters[i].position < quarters[j].position })
	return quarters
}

// GenerateSubBracket はサブブラケットをトーナメント＋試合構造含めて一括生成する。
func (s *Tournament) GenerateSubBracket(ctx context.Context, input *model.GenerateSubBracketInput) (*db_model.Tournament, error) {
	var tournament *db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 大会タイプチェック
		comp, err := s.competitionRepository.Get(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		if comp.Type != string(model.CompetitionTypeTournament) {
			return errors.ErrNotTournamentCompetition
		}

		// displayOrder の算出
		existing, err := s.tournamentRepository.ListByCompetitionID(ctx, tx, input.CompetitionID)
		if err != nil {
			return err
		}
		maxOrder := 0
		for _, t := range existing {
			if t.DisplayOrder > maxOrder {
				maxOrder = t.DisplayOrder
			}
		}

		var pm sql.NullString
		if input.PlacementMethod != nil {
			pm = sql.NullString{Valid: true, String: input.PlacementMethod.String()}
		}

		t := &db_model.Tournament{
			ID:              ulid.Make(),
			CompetitionID:   input.CompetitionID,
			Name:            input.Name,
			BracketType:     string(model.BracketTypeSub),
			PlacementMethod: pm,
			DisplayOrder:    maxOrder + 1,
		}
		t, err = s.tournamentRepository.Save(ctx, tx, t)
		if err != nil {
			return errors.ErrSaveTournament
		}

		// ブラケット構造を一括生成（generateMainBracketMatches を再利用）
		if input.TeamCount >= 2 {
			if _, err := s.generateMainBracketMatches(ctx, tx, t, input.TeamCount, input.CompetitionID); err != nil {
				return err
			}
		}

		// デフォルトロケーションを生成した試合に適用
		if comp.DefaultLocationID.Valid {
			if err := tx.WithContext(ctx).Model(&db_model.Match{}).
				Where("competition_id = ? AND location_id IS NULL", input.CompetitionID).
				Update("location_id", comp.DefaultLocationID.String).Error; err != nil {
				return errors.Wrap(err)
			}
		}

		tournament = t
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return tournament, nil
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
		if comp.Type != string(model.CompetitionTypeTournament) {
			return errors.ErrNotTournamentCompetition
		}

		// MAIN重複チェック
		if input.BracketType == model.BracketTypeMain {
			_, err := s.tournamentRepository.GetMainByCompetitionID(ctx, tx, input.CompetitionID)
			if err == nil {
				return errors.ErrDuplicateMainBracket
			}
			if !errors.Is(err, errors.ErrTournamentNotFound) {
				return err
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

func (s *Tournament) UpdateTournament(ctx context.Context, id string, input model.UpdateTournamentInput) (*db_model.Tournament, error) {
	var tournament *db_model.Tournament

	err := s.db.Transaction(func(tx *gorm.DB) error {
		t, err := s.tournamentRepository.Get(ctx, tx, id)
		if err != nil {
			return err
		}

		if input.Name != nil {
			t.Name = *input.Name
		}
		if input.DisplayOrder != nil {
			t.DisplayOrder = int(*input.DisplayOrder)
		}

		t, err = s.tournamentRepository.Save(ctx, tx, t)
		if err != nil {
			return errors.ErrSaveTournament
		}
		tournament = t
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

		if t.BracketType == string(model.BracketTypeMain) {
			return errors.ErrMainBracketDeleteForbidden
		}

		// 所属する試合の match_ids を収集
		slots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, id)
		if err != nil {
			return err
		}

		matchIDs, err := collectMatchIDsFromSlots(ctx, tx, s.matchRepository, slots)
		if err != nil {
			return err
		}

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
		matchTime := time.Now()
		if input.Time != nil {
			parsed, err := time.Parse(time.RFC3339, *input.Time)
			if err != nil {
				return errors.Wrap(err)
			}
			matchTime = parsed
		}

		// デフォルトロケーションを取得
		comp, err := s.competitionRepository.Get(ctx, tx, t.CompetitionID)
		if err != nil {
			return errors.Wrap(err)
		}

		// Match 作成
		m := &db_model.Match{
			ID:            ulid.Make(),
			Time:          matchTime,
			Status:        string(model.MatchStatusStandby),
			CompetitionID: t.CompetitionID,
			LocationID:    comp.DefaultLocationID,
		}
		m, err = s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		// MatchEntries (2つ)
		entry1 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: m.ID, TeamID: sql.NullString{Valid: false}, Score: 0}
		entry2 := &db_model.MatchEntry{ID: ulid.Make(), MatchID: m.ID, TeamID: sql.NullString{Valid: false}, Score: 0}
		if _, err := s.matchRepository.SaveMatchEntry(ctx, tx, entry1); err != nil {
			return errors.Wrap(err)
		}
		if _, err := s.matchRepository.SaveMatchEntry(ctx, tx, entry2); err != nil {
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
		if slot.SourceType != string(model.SlotSourceTypeSeed) {
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

// resetBracketsInTx はトランザクション内でブラケット群を削除する内部メソッド
func (s *Tournament) resetBracketsInTx(ctx context.Context, tx *gorm.DB, tournaments []*db_model.Tournament) error {
	var allMatchIDs []string
	matchIDSet := make(map[string]bool)

	for _, t := range tournaments {
		slots, err := s.tournamentRepository.ListByTournamentID(ctx, tx, t.ID)
		if err != nil {
			return err
		}
		ids, err := collectMatchIDsFromSlots(ctx, tx, s.matchRepository, slots)
		if err != nil {
			return err
		}
		for _, id := range ids {
			if !matchIDSet[id] {
				matchIDSet[id] = true
				allMatchIDs = append(allMatchIDs, id)
			}
		}
	}

	for _, t := range tournaments {
		if _, err := s.tournamentRepository.Delete(ctx, tx, t.ID); err != nil {
			return err
		}
	}

	for _, matchID := range allMatchIDs {
		if _, err := s.matchRepository.Delete(ctx, tx, matchID); err != nil {
			return err
		}
	}

	return nil
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

		return s.resetBracketsInTx(ctx, tx, tournaments)
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
	matches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, tx, []string{tournamentID})
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
		if sl.SourceType == string(model.SlotSourceTypeMatchWinner) && sl.SourceMatchID.Valid {
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
		return errors.ErrInvalidSourceMatch
	}
	return nil
}

// checkNoScores はブラケット内の試合にスコアが入っていないことを確認する
func (s *Tournament) checkNoScores(ctx context.Context, tx *gorm.DB, tournamentID string) error {
	matches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, tx, []string{tournamentID})
	if err != nil {
		return err
	}
	for _, m := range matches {
		if m.Status == string(model.MatchStatusOngoing) || m.Status == string(model.MatchStatusFinished) {
			return errors.ErrTournamentHasScores
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

	// tournament IDs を収集
	tournamentIDs := make([]string, len(tournaments))
	for i, t := range tournaments {
		tournamentIDs[i] = t.ID
	}

	// 全スロットを一括取得
	allSlots, err := s.tournamentRepository.BatchGetByTournamentIDs(ctx, s.db, tournamentIDs)
	if err != nil {
		return err
	}

	// 全試合を一括取得
	allMatches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, s.db, tournamentIDs)
	if err != nil {
		return err
	}
	allMatchIDs := make([]string, len(allMatches))
	matchIDSet := make(map[string]bool)
	for i, m := range allMatches {
		allMatchIDs[i] = m.ID
		matchIDSet[m.ID] = true
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
		return errors.ErrDAGCycleDetected
	}
	return nil
}

// CheckTournamentCompetition はcompetitionがトーナメント型かチェックし、そうであればエラーを返す（createMatch ガード用）
func (s *Tournament) CheckTournamentCompetition(ctx context.Context, competitionID string) error {
	comp, err := s.competitionRepository.Get(ctx, s.db, competitionID)
	if err != nil {
		return nil // competition が見つからない場合は他のバリデーションに任せる
	}
	if comp.Type == string(model.CompetitionTypeTournament) {
		return errors.ErrTournamentMatchCreateOnly
	}
	return nil
}

// --- ヘルパー ---

func collectMatchIDsFromSlots(ctx context.Context, tx *gorm.DB, matchRepo repository.Match, slots []*db_model.TournamentSlot) ([]string, error) {
	if len(slots) == 0 {
		return nil, nil
	}

	entryIDs := make([]string, len(slots))
	for i, sl := range slots {
		entryIDs[i] = sl.MatchEntryID
	}

	// entry_id → match を辿るために match_entries を Repository 経由で取得
	entries, err := matchRepo.BatchGetMatchEntriesByIDs(ctx, tx, entryIDs)
	if err != nil {
		return nil, err
	}

	matchIDSet := make(map[string]bool)
	var matchIDs []string
	for _, e := range entries {
		if !matchIDSet[e.MatchID] {
			matchIDSet[e.MatchID] = true
			matchIDs = append(matchIDs, e.MatchID)
		}
	}
	return matchIDs, nil
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
		case string(model.SlotSourceTypeMatchWinner):
			teamID = winnerTeamID
		case string(model.SlotSourceTypeMatchLoser):
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

// matchGraph はブラケット全体のインメモリグラフ。
// sourceMatchID → 後続の (slotMatchEntryID, dependentMatchID) リスト
type matchGraph struct {
	edges    map[string][]matchGraphEdge
	matchMap map[string]*db_model.Match
}

type matchGraphEdge struct {
	slotMatchEntryID string
	dependentMatchID string
}

// buildMatchGraph は competition 内の全ブラケットからインメモリグラフを構築する。
func (s *Tournament) buildMatchGraph(ctx context.Context, tx *gorm.DB, competitionID string) (*matchGraph, error) {
	bg, err := s.loadBracketGraph(ctx, tx, competitionID)
	if err != nil {
		return nil, err
	}

	// entryID → matchID
	entryToMatchID := bg.entryIDToMatchID

	// source_match_id → edges
	edges := make(map[string][]matchGraphEdge)
	for _, slots := range bg.slotsByTournament {
		for _, slot := range slots {
			if slot.SourceMatchID.Valid {
				depMatchID := entryToMatchID[slot.MatchEntryID]
				if depMatchID != "" {
					edges[slot.SourceMatchID.String] = append(edges[slot.SourceMatchID.String], matchGraphEdge{
						slotMatchEntryID: slot.MatchEntryID,
						dependentMatchID: depMatchID,
					})
				}
			}
		}
	}

	// matchMap を構築
	matchMap := make(map[string]*db_model.Match)
	for _, matches := range bg.matchesByTournament {
		for _, m := range matches {
			matchMap[m.ID] = m
		}
	}

	return &matchGraph{edges: edges, matchMap: matchMap}, nil
}

// CanModifyScore はトーナメント試合のスコア修正が可能かを判定する。
// 後続試合（ブラケット間含む）に ONGOING または FINISHED の試合があれば修正不可。
func (s *Tournament) CanModifyScore(ctx context.Context, tx *gorm.DB, matchID string) error {
	m, err := s.matchRepository.Get(ctx, tx, matchID)
	if err != nil {
		return err
	}
	mg, err := s.buildMatchGraph(ctx, tx, m.CompetitionID)
	if err != nil {
		return err
	}
	visited := make(map[string]bool)
	return canModifyScoreWalk(mg, matchID, visited)
}

func canModifyScoreWalk(mg *matchGraph, matchID string, visited map[string]bool) error {
	if visited[matchID] {
		return nil
	}
	visited[matchID] = true

	for _, edge := range mg.edges[matchID] {
		dep := mg.matchMap[edge.dependentMatchID]
		if dep != nil && (dep.Status == string(model.MatchStatusOngoing) || dep.Status == string(model.MatchStatusFinished)) {
			return errors.ErrTournamentScoreModificationLocked
		}
		if err := canModifyScoreWalk(mg, edge.dependentMatchID, visited); err != nil {
			return err
		}
	}
	return nil
}

// RollbackFromMatch はスコア修正時に後続スロットのチーム配置を再帰的にクリアする。
func (s *Tournament) RollbackFromMatch(ctx context.Context, tx *gorm.DB, matchID string) error {
	m, err := s.matchRepository.Get(ctx, tx, matchID)
	if err != nil {
		return err
	}
	mg, err := s.buildMatchGraph(ctx, tx, m.CompetitionID)
	if err != nil {
		return err
	}
	visited := make(map[string]bool)
	return s.rollbackWalk(ctx, tx, mg, matchID, visited)
}

// rollbackWalk は指定された試合を起点に、インメモリグラフを辿ってチーム配置をクリアする。
// 起点試合の winner_team_id もクリアする。
func (s *Tournament) rollbackWalk(ctx context.Context, tx *gorm.DB, mg *matchGraph, matchID string, visited map[string]bool) error {
	if visited[matchID] {
		return nil
	}
	visited[matchID] = true

	// この試合の winner_team_id をクリア
	if m, ok := mg.matchMap[matchID]; ok && m.WinnerTeamID.Valid {
		m.WinnerTeamID = sql.NullString{Valid: false}
		if _, err := s.matchRepository.Save(ctx, tx, m); err != nil {
			return err
		}
	}

	for _, edge := range mg.edges[matchID] {
		if err := s.matchRepository.ClearMatchEntryTeamID(ctx, tx, edge.slotMatchEntryID); err != nil {
			return err
		}
		if err := s.rollbackWalk(ctx, tx, mg, edge.dependentMatchID, visited); err != nil {
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

	return nil
}

// IsTournamentMatch は competition.type で判定する。
func (s *Tournament) IsTournamentMatch(ctx context.Context, tx *gorm.DB, competitionID string) (bool, error) {
	comp, err := s.competitionRepository.Get(ctx, tx, competitionID)
	if err != nil {
		return false, err
	}
	return comp.Type == string(model.CompetitionTypeTournament), nil
}

// --- ブラケットグラフ共通ヘルパー ---

// bracketGraph はブラケット構造のデータ一式を保持する。
type bracketGraph struct {
	tournaments         []*db_model.Tournament
	slotsByTournament   map[string][]*db_model.TournamentSlot
	matchesByTournament map[string][]*db_model.Match
	entriesByMatch      map[string][]*db_model.MatchEntry
	entryIDToMatchID    map[string]string
}

// loadBracketGraph は competition 内の全ブラケット構造を一括取得する。
func (s *Tournament) loadBracketGraph(ctx context.Context, db *gorm.DB, competitionID string) (*bracketGraph, error) {
	tournaments, err := s.tournamentRepository.ListByCompetitionID(ctx, db, competitionID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if len(tournaments) == 0 {
		return &bracketGraph{tournaments: tournaments}, nil
	}

	tournamentIDs := make([]string, len(tournaments))
	for i, t := range tournaments {
		tournamentIDs[i] = t.ID
	}

	allSlots, err := s.tournamentRepository.BatchGetByTournamentIDs(ctx, db, tournamentIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	slotsByTournament := make(map[string][]*db_model.TournamentSlot)
	for _, slot := range allSlots {
		slotsByTournament[slot.TournamentID] = append(slotsByTournament[slot.TournamentID], slot)
	}

	allMatches, err := s.tournamentRepository.ListMatchesByTournamentIDs(ctx, db, tournamentIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

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

	return &bracketGraph{
		tournaments:         tournaments,
		slotsByTournament:   slotsByTournament,
		matchesByTournament: matchesByTournament,
		entriesByMatch:      entriesByMatch,
		entryIDToMatchID:    entryIDToMatchID,
	}, nil
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
	bg, err := s.loadBracketGraph(ctx, db, competitionID)
	if err != nil {
		return nil, err
	}
	if len(bg.tournaments) == 0 {
		return []*model.TournamentRanking{}, nil
	}

	return computeTournamentRanking(bg.tournaments, bg.slotsByTournament, bg.matchesByTournament, bg.entriesByMatch, bg.entryIDToMatchID), nil
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
		if t.BracketType == string(model.BracketTypeMain) {
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
		if slot.SourceType == string(model.SlotSourceTypeMatchWinner) && slot.SourceMatchID.Valid {
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
		if m.Status != string(model.MatchStatusFinished) {
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
		if t.BracketType == string(model.BracketTypeMain) {
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

	bg, err := s.loadBracketGraph(ctx, tx, competitionID)
	if err != nil {
		return errors.Wrap(err)
	}
	if len(bg.tournaments) == 0 {
		return nil // ブラケット未生成の場合はスキップ
	}

	tiedRanks := computeTiedRanks(bg.tournaments, bg.slotsByTournament, bg.matchesByTournament, bg.entryIDToMatchID)

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
		if slot.SourceType == string(model.SlotSourceTypeMatchLoser) && slot.SourceMatchID.Valid {
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
