package service

import (
	"context"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
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
			LocationID:    input.LocationID,
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
	}
	if input.LocationID != nil {
		match.LocationID = *input.LocationID
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
			for _, result := range input.Results {
				if _, err := s.matchRepository.UpdateMatchEntryScore(ctx, tx, id, result.TeamID, int(result.Score)); err != nil {
					return errors.ErrUpdateMatchEntryScore
				}
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
	match, err := s.matchRepository.Get(ctx, s.db, matchId)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	_, err = s.matchRepository.DeleteMatchEntries(ctx, s.db, matchId, teamIds)
	if err != nil {
		return nil, errors.ErrDeleteMatchEntry
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
		locationMatchesMap[match.LocationID] = append(locationMatchesMap[match.LocationID], match)
	}
	return locationMatchesMap, nil
}
