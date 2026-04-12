package service

import (
	"context"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/auth"
	"sports-day/api/pkg/errors"
	pkggorm "sports-day/api/pkg/gorm"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Match struct {
	db                    *gorm.DB
	matchRepository       repository.Match
	teamRepository        repository.Team
	locationRepository    repository.Location
	competitionRepository repository.Competition
	judgmentRepository    repository.Judgment
	competitionService    *Competition
	tournamentService     *Tournament
	judgmentService       *Judgment
}

func NewMatch(db *gorm.DB, matchRepository repository.Match, teamRepository repository.Team, locationRepository repository.Location, competitionRepository repository.Competition, judgmentRepository repository.Judgment) Match {
	return Match{
		db:                    db,
		matchRepository:       matchRepository,
		teamRepository:        teamRepository,
		locationRepository:    locationRepository,
		competitionRepository: competitionRepository,
		judgmentRepository:    judgmentRepository,
	}
}

// SetCompetitionService は循環依存を避けるためにセッター注入する。
func (s *Match) SetCompetitionService(cs *Competition) {
	s.competitionService = cs
}

// SetTournamentService は循環依存を避けるためにセッター注入する。
func (s *Match) SetTournamentService(ts *Tournament) {
	s.tournamentService = ts
}

// SetJudgmentService は循環依存を避けるためにセッター注入する。
func (s *Match) SetJudgmentService(js *Judgment) {
	s.judgmentService = js
}

func (s *Match) Create(ctx context.Context, input *model.CreateMatchInput) (*db_model.Match, error) {
	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		parsedTime, err := time.Parse(time.RFC3339, input.Time)
		if err != nil {
			return errors.Wrap(err)
		}

		m := &db_model.Match{
			ID:            ulid.Make(),
			Time:          parsedTime,
			Status:        string(input.Status),
			LocationID:    pkggorm.ToNullString(input.LocationID),
			CompetitionID: input.CompetitionID,
			WinnerTeamID:  pkggorm.ToNullString(nil),
		}
		created, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		if len(input.TeamIds) > 0 {
			if _, err := s.matchRepository.AddMatchEntries(ctx, tx, created.ID, input.TeamIds); err != nil {
				return errors.ErrAddMatchEntry
			}
		}

		// 審判を作成（指定されていれば設定、なければnull）
		judgment := &db_model.Judgment{
			ID:      created.ID,                // MatchIDと同じIDを使用
			Name:    pkggorm.ToNullString(nil), // デフォルトは未設定
			UserID:  pkggorm.ToNullString(nil), // デフォルトは未割り当て
			TeamID:  pkggorm.ToNullString(nil), // デフォルトは未割り当て
			GroupID: pkggorm.ToNullString(nil), // デフォルトは未割り当て
		}

		// 審判が指定されている場合の処理
		if input.Judgment != nil {
			j := input.Judgment

			// バリデーション: User, Team, Group のうち1つだけが指定されているかチェック
			count := 0
			if j.Name != nil {
				count++
			}
			if j.UserID != nil {
				count++
			}
			if j.TeamID != nil {
				count++
			}
			if j.GroupID != nil {
				count++
			}

			// 1つだけ指定されている場合のみ設定
			if count == 1 {
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
			} else if count > 1 {
				// 複数指定されている場合はエラー
				return errors.ErrJudgmentEntryInvalid
			}
			// count == 0 の場合は何も設定せず（null値のまま）
		}

		if _, err := s.judgmentRepository.Save(ctx, tx, judgment); err != nil {
			return errors.ErrSaveJudgment
		}

		match = created
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (s *Match) Get(ctx context.Context, id string) (*db_model.Match, error) {
	match, err := s.matchRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (s *Match) UpdateDetail(ctx context.Context, id string, input model.UpdateMatchDetailInput) (*db_model.Match, error) {
	match, err := s.matchRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if input.Time != nil {
		parsedTime, err := time.Parse(time.RFC3339, *input.Time)
		if err != nil {
			return nil, errors.Wrap(err)
		}
		match.Time = parsedTime
		match.TimeManual = true
	}
	if input.LocationID != nil {
		match.LocationID = pkggorm.ToNullString(input.LocationID)
		match.LocationManual = true
	}

	match, err = s.matchRepository.Save(ctx, s.db, match)
	if err != nil {
		return nil, errors.ErrSaveMatch
	}
	return match, nil
}

func (s *Match) UpdateResult(ctx context.Context, id string, input model.UpdateMatchResultInput) (*db_model.Match, error) {
	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		m, err := s.matchRepository.Get(ctx, tx, id)
		if err != nil {
			return err
		}

		// competition.type でトーナメント判定
		isTournament := false
		if s.tournamentService != nil {
			t, err := s.tournamentService.IsTournamentMatch(ctx, tx, m.CompetitionID)
			if err != nil {
				return err
			}
			isTournament = t
		}

		// スコア修正制限チェック: 進出先の試合が稼働中なら修正不可（リーグ・トーナメント共通）
		if s.competitionService != nil && (input.Results != nil || input.WinnerTeamID != nil) {
			if err := s.competitionService.CheckScoreModificationAllowed(ctx, tx, m.CompetitionID); err != nil {
				return err
			}
		}

		// トーナメント固有: グラフ探索によるスコア修正制限
		if isTournament && s.tournamentService != nil && (input.Results != nil || input.WinnerTeamID != nil) {
			if err := s.tournamentService.CanModifyScore(ctx, tx, id); err != nil {
				return err
			}
			// 修正可能なら巻き戻し
			if err := s.tournamentService.RollbackFromMatch(ctx, tx, id); err != nil {
				return err
			}
		}

		// トーナメント固有: 引き分け禁止バリデーション（DB保存前に input の値で判定）
		if isTournament && s.tournamentService != nil {
			if err := s.tournamentService.ValidateNoDrawForTournament(ctx, tx, id, input.Status, input.WinnerTeamID, input.Results); err != nil {
				return err
			}
		}

		if input.Status != nil {
			m.Status = string(*input.Status)
		}
		if input.WinnerTeamID != nil {
			m.WinnerTeamID = pkggorm.ToNullString(input.WinnerTeamID)
		}

		updated, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		if input.Results != nil {
			seenTeams := make(map[string]struct{}, len(input.Results))
			for _, result := range input.Results {
				if _, dup := seenTeams[result.TeamID]; dup {
					return errors.ErrUpdateMatchEntryScore
				}
				seenTeams[result.TeamID] = struct{}{}
				if _, err := s.matchRepository.UpdateMatchEntryScore(ctx, tx, id, result.TeamID, int(result.Score)); err != nil {
					return errors.ErrUpdateMatchEntryScore
				}
			}
		}

		match = updated

		// 副作用: FINISHED 時の処理
		if updated.Status == string(model.MatchStatusFinished) {
			// トーナメント試合では winner 必須
			if isTournament && !updated.WinnerTeamID.Valid {
				return errors.ErrTournamentDrawForbidden
			}
			if isTournament && s.tournamentService != nil && updated.WinnerTeamID.Valid {
				// トーナメント試合: 自動進行
				if err := s.tournamentService.ProgressMatch(ctx, tx, id, updated.WinnerTeamID.String); err != nil {
					return err
				}

				// 進出トリガー: 全試合完了 or 部分完了（rank_spec確定分）
				if s.competitionService != nil {
					if err := s.competitionService.TryPromote(ctx, tx, updated.CompetitionID); err != nil {
						return err
					}
				}
			} else if !isTournament && s.competitionService != nil {
				// リーグ試合: 既存の進出処理
				allComplete, err := s.competitionService.IsAllMatchesComplete(ctx, tx, updated.CompetitionID)
				if err != nil {
					return err
				}
				if allComplete {
					if err := s.competitionService.TryPromote(ctx, tx, updated.CompetitionID); err != nil {
						return err
					}
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}

	return match, nil
}

func (s *Match) Delete(ctx context.Context, id string) (*db_model.Match, error) {
	match, err := s.matchRepository.Delete(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (s *Match) List(ctx context.Context) ([]*db_model.Match, error) {
	matches, err := s.matchRepository.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (s *Match) AddEntries(ctx context.Context, matchId string, teamIds []string) (*db_model.Match, error) {
	_, err := s.matchRepository.Get(ctx, s.db, matchId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}

	if _, err := s.matchRepository.AddMatchEntries(ctx, s.db, matchId, teamIds); err != nil {
		return nil, errors.ErrAddMatchEntry
	}

	match, err := s.matchRepository.Get(ctx, s.db, matchId)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (s *Match) DeleteEntries(ctx context.Context, matchId string, teamIds []string) (*db_model.Match, error) {
	_, err := s.matchRepository.Get(ctx, s.db, matchId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.matchRepository.DeleteMatchEntries(ctx, s.db, matchId, teamIds)
	if err != nil {
		return nil, errors.ErrDeleteMatchEntry
	}

	match, err := s.matchRepository.Get(ctx, s.db, matchId)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (s *Match) GetMatchesMapByIDs(ctx context.Context, matchIDs []string) (map[string]*db_model.Match, error) {
	matches, err := s.matchRepository.BatchGet(ctx, s.db, matchIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	matchMap := make(map[string]*db_model.Match)
	for _, match := range matches {
		matchMap[match.ID] = match
	}
	return matchMap, nil
}

func (s *Match) GetMatchEntriesMapByMatchIDs(ctx context.Context, matchIds []string) (map[string][]*db_model.MatchEntry, error) {
	matchEntries, err := s.matchRepository.BatchGetMatchEntriesByMatchIDs(ctx, s.db, matchIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	matchEntriesMap := make(map[string][]*db_model.MatchEntry)
	for _, matchEntry := range matchEntries {
		matchEntriesMap[matchEntry.MatchID] = append(matchEntriesMap[matchEntry.MatchID], matchEntry)
	}
	return matchEntriesMap, nil
}

func (s *Match) GetMatchEntriesMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.MatchEntry, error) {
	entries, err := s.matchRepository.BatchGetMatchEntriesByIDs(ctx, s.db, ids)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	result := make(map[string]*db_model.MatchEntry)
	for _, entry := range entries {
		result[entry.ID] = entry
	}
	return result, nil
}

func (s *Match) GetMatchEntriesMapByTeamIDs(ctx context.Context, teamIds []string) (map[string][]*db_model.MatchEntry, error) {
	matchEntries, err := s.matchRepository.BatchGetMatchEntriesByTeamIDs(ctx, s.db, teamIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	matchEntriesMap := make(map[string][]*db_model.MatchEntry)
	for _, matchEntry := range matchEntries {
		if matchEntry.TeamID.Valid {
			matchEntriesMap[matchEntry.TeamID.String] = append(matchEntriesMap[matchEntry.TeamID.String], matchEntry)
		}
	}
	return matchEntriesMap, nil
}

func (s *Match) GetMatchesMapByCompetitionIDs(ctx context.Context, competitionIds []string) (map[string][]*db_model.Match, error) {
	matches, err := s.matchRepository.BatchGetMatchesByCompetitionIDs(ctx, s.db, competitionIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	competitionMatchesMap := make(map[string][]*db_model.Match)
	for _, match := range matches {
		competitionMatchesMap[match.CompetitionID] = append(competitionMatchesMap[match.CompetitionID], match)
	}
	return competitionMatchesMap, nil
}

func (s *Match) GetMatchesMapByLocationIDs(ctx context.Context, locationIds []string) (map[string][]*db_model.Match, error) {
	matches, err := s.matchRepository.BatchGetMatchesByLocationIDs(ctx, s.db, locationIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	locationMatchesMap := make(map[string][]*db_model.Match)
	for _, match := range matches {
		if match.LocationID.Valid {
			locationMatchesMap[match.LocationID.String] = append(locationMatchesMap[match.LocationID.String], match)
		}
	}
	return locationMatchesMap, nil
}

// NextJudgeMatchAtLocation は指定ロケーションで呼び出しユーザーが審判として
// 割り当てられている次の STANDBY/ONGOING 試合を返す。該当なしの場合は nil を返す。
func (s *Match) NextJudgeMatchAtLocation(ctx context.Context, locationID string) (*db_model.Match, error) {
	user, ok := auth.GetUser(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	// 時刻昇順で STANDBY/ONGOING の試合を取得
	matches, err := s.matchRepository.ListActiveMatchesByLocationID(ctx, s.db, locationID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if len(matches) == 0 {
		return nil, nil
	}

	// 時刻順で最初の未完了試合 = 現在の試合
	currentMatch := matches[0]

	// 現在の試合の審判が自分かチェック
	judgment, err := s.judgmentRepository.Get(ctx, s.db, currentMatch.ID)
	if err != nil {
		return nil, nil
	}
	if s.judgmentService == nil {
		return nil, nil
	}
	if err := s.judgmentService.IsAssignedReferee(ctx, s.db, judgment, user.ID); err != nil {
		return nil, nil
	}

	return currentMatch, nil
}

// StartMatchJudging は審判の出席記録と試合ステータスのONGOING化を
// 1トランザクションで行う複合操作。審判本人のみ実行可能。
func (s *Match) StartMatchJudging(ctx context.Context, matchID string) (*db_model.Match, error) {
	user, ok := auth.GetUser(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	if s.judgmentService == nil {
		return nil, errors.ErrNotAssignedReferee
	}

	var result *db_model.Match
	err := s.db.Transaction(func(tx *gorm.DB) error {
		judgment, err := s.judgmentRepository.Get(ctx, tx, matchID)
		if err != nil {
			return errors.Wrap(err)
		}

		if err := s.judgmentService.IsAssignedReferee(ctx, tx, judgment, user.ID); err != nil {
			return err
		}

		m, err := s.matchRepository.Get(ctx, tx, matchID)
		if err != nil {
			return errors.Wrap(err)
		}

		if m.Status == string(model.MatchStatusFinished) || m.Status == string(model.MatchStatusCanceled) {
			return errors.ErrMatchAlreadyFinished
		}

		judgment.IsAttending = true
		if _, err := s.judgmentRepository.Save(ctx, tx, judgment); err != nil {
			return errors.ErrSaveJudgment
		}

		if m.Status == string(model.MatchStatusStandby) {
			// この試合がそのロケーションの時刻順で最初の未完了試合かチェック
			if m.LocationID.Valid {
				active, err := s.matchRepository.ListActiveMatchesByLocationID(ctx, tx, m.LocationID.String)
				if err != nil {
					return errors.Wrap(err)
				}
				if len(active) > 0 && active[0].ID != m.ID {
					return errors.ErrLocationBusy
				}
			}
			m.Status = string(model.MatchStatusOngoing)
		}

		updated, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}
		result = updated
		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}
	return result, nil
}

// SubmitScore は審判がスコアを提出する。認可チェック・出席確認・ステータスチェックを
// 全てトランザクション内で行い、整合性を保証する。
func (s *Match) SubmitScore(ctx context.Context, matchID string, input model.SubmitScoreInput) (*db_model.Match, error) {
	user, ok := auth.GetUser(ctx)
	if !ok {
		return nil, errors.ErrUnauthorized
	}

	if s.judgmentService == nil {
		return nil, errors.ErrNotAssignedReferee
	}

	var match *db_model.Match

	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 審判情報を取得して認可チェック
		judgment, err := s.judgmentRepository.Get(ctx, tx, matchID)
		if err != nil {
			return errors.Wrap(err)
		}

		if err := s.judgmentService.IsAssignedReferee(ctx, tx, judgment, user.ID); err != nil {
			return err
		}

		// 出席確認
		if !judgment.IsAttending {
			return errors.ErrJudgmentNotAttending
		}

		// 試合が既にFINISHEDなら拒否
		m, err := s.matchRepository.Get(ctx, tx, matchID)
		if err != nil {
			return errors.Wrap(err)
		}
		if m.Status == string(model.MatchStatusFinished) {
			return errors.ErrMatchAlreadyFinished
		}

		// トーナメント判定
		isTournament := false
		if s.tournamentService != nil {
			t, err := s.tournamentService.IsTournamentMatch(ctx, tx, m.CompetitionID)
			if err != nil {
				return err
			}
			isTournament = t
		}

		// スコア修正制限チェック
		if s.competitionService != nil && input.Results != nil {
			if err := s.competitionService.CheckScoreModificationAllowed(ctx, tx, m.CompetitionID); err != nil {
				return err
			}
		}

		// トーナメント固有: 引き分け禁止バリデーション
		status := model.MatchStatusFinished
		if isTournament && s.tournamentService != nil {
			if err := s.tournamentService.ValidateNoDrawForTournament(ctx, tx, matchID, &status, input.WinnerTeamID, input.Results); err != nil {
				return err
			}
		}

		// ステータスをFINISHEDに設定
		m.Status = string(model.MatchStatusFinished)
		if input.WinnerTeamID != nil {
			m.WinnerTeamID = pkggorm.ToNullString(input.WinnerTeamID)
		}

		updated, err := s.matchRepository.Save(ctx, tx, m)
		if err != nil {
			return errors.ErrSaveMatch
		}

		// スコア更新（重複TeamIDチェック付き）
		seenTeams := make(map[string]struct{}, len(input.Results))
		for _, result := range input.Results {
			if _, dup := seenTeams[result.TeamID]; dup {
				return errors.ErrUpdateMatchEntryScore
			}
			seenTeams[result.TeamID] = struct{}{}
			if _, err := s.matchRepository.UpdateMatchEntryScore(ctx, tx, matchID, result.TeamID, int(result.Score)); err != nil {
				return errors.ErrUpdateMatchEntryScore
			}
		}

		match = updated

		// FINISHED時の副作用: トーナメント自動進行 / リーグ昇格
		if isTournament && !updated.WinnerTeamID.Valid {
			return errors.ErrTournamentDrawForbidden
		}
		if isTournament && s.tournamentService != nil && updated.WinnerTeamID.Valid {
			if err := s.tournamentService.ProgressMatch(ctx, tx, matchID, updated.WinnerTeamID.String); err != nil {
				return err
			}
			if s.competitionService != nil {
				if err := s.competitionService.TryPromote(ctx, tx, updated.CompetitionID); err != nil {
					return err
				}
			}
		} else if !isTournament && s.competitionService != nil {
			allComplete, err := s.competitionService.IsAllMatchesComplete(ctx, tx, updated.CompetitionID)
			if err != nil {
				return err
			}
			if allComplete {
				if err := s.competitionService.TryPromote(ctx, tx, updated.CompetitionID); err != nil {
					return err
				}
			}
		}

		return nil
	})

	if err != nil {
		return nil, errors.Wrap(err)
	}

	return match, nil
}
