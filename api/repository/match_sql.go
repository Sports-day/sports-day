package repository

import (
	"context"
	"database/sql"

	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
)

type match struct{}

func NewMatch() Match {
	return match{}
}

func (r match) Save(ctx context.Context, db *gorm.DB, match *db_model.Match) (*db_model.Match, error) {
	if err := db.WithContext(ctx).Save(match).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (r match) DeleteByCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) error {
	if err := db.WithContext(ctx).Where("competition_id = ?", competitionID).Delete(&db_model.Match{}).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r match) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error) {
	var match db_model.Match
	if err := db.WithContext(ctx).First(&match, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.WithContext(ctx).Delete(&match).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &match, nil
}

func (r match) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error) {
	var match db_model.Match
	if err := db.WithContext(ctx).First(&match, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &match, nil
}

func (r match) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r match) List(ctx context.Context, db *gorm.DB) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r match) AddMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error) {
	if len(teamIds) == 0 {
		return []*db_model.MatchEntry{}, nil
	}
	entries := make([]*db_model.MatchEntry, 0, len(teamIds))
	for _, teamId := range teamIds {
		entry := &db_model.MatchEntry{
			ID:      ulid.Make(),
			MatchID: matchId,
			Score:   0,
		}

		// teamIdが空文字列の場合はNULL値を設定
		if teamId == "" {
			entry.TeamID = sql.NullString{Valid: false}
		} else {
			entry.TeamID = sql.NullString{String: teamId, Valid: true}
		}

		entries = append(entries, entry)
	}
	if err := db.WithContext(ctx).Create(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r match) DeleteMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id = ? AND team_id IN ?", matchId, teamIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	if err := db.WithContext(ctx).Where("match_id = ? AND team_id IN ?", matchId, teamIds).Delete(&db_model.MatchEntry{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r match) UpdateMatchEntryScore(ctx context.Context, db *gorm.DB, matchId string, teamId string, score int) (*db_model.MatchEntry, error) {
	result := db.WithContext(ctx).Model(&db_model.MatchEntry{}).
		Where("match_id = ? AND team_id = ?", matchId, teamId).
		Update("score", score)
	if result.Error != nil {
		return nil, errors.Wrap(result.Error)
	}
	if result.RowsAffected == 0 {
		return nil, errors.ErrMatchNotFound
	}

	var updated db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id = ? AND team_id = ?", matchId, teamId).First(&updated).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return &updated, nil
}

func (r match) BatchGetMatchEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("team_id IN ?", teamIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r match) BatchGetMatchEntriesByMatchIDs(ctx context.Context, db *gorm.DB, matchIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id IN ?", matchIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r match) BatchGetMatchesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("competition_id IN ?", competitionIds).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r match) BatchGetMatchesByLocationIDs(ctx context.Context, db *gorm.DB, locationIds []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("location_id IN ?", locationIds).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r match) UpdateMatchEntryTeamIDOptimistic(ctx context.Context, db *gorm.DB, matchEntryID string, teamID string) error {
	result := db.WithContext(ctx).Model(&db_model.MatchEntry{}).
		Where("id = ? AND team_id IS NULL", matchEntryID).
		Update("team_id", teamID)
	if result.Error != nil {
		return errors.Wrap(result.Error)
	}
	if result.RowsAffected == 0 {
		return errors.ErrSlotAlreadyAssigned
	}
	return nil
}

func (r match) GetMatchEntryByID(ctx context.Context, db *gorm.DB, id string) (*db_model.MatchEntry, error) {
	var entry db_model.MatchEntry
	if err := db.WithContext(ctx).First(&entry, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &entry, nil
}

func (r match) BatchGetMatchEntriesByIDs(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r match) ClearMatchEntryTeamID(ctx context.Context, db *gorm.DB, matchEntryID string) error {
	if err := db.WithContext(ctx).Model(&db_model.MatchEntry{}).
		Where("id = ?", matchEntryID).
		Update("team_id", nil).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r match) UpdateMatchEntryTeamID(ctx context.Context, db *gorm.DB, matchEntryID string, teamID string) error {
	if err := db.WithContext(ctx).Model(&db_model.MatchEntry{}).
		Where("id = ?", matchEntryID).
		Update("team_id", teamID).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r match) SaveMatchEntry(ctx context.Context, db *gorm.DB, entry *db_model.MatchEntry) (*db_model.MatchEntry, error) {
	if err := db.WithContext(ctx).Save(entry).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entry, nil
}

func (r match) SaveBatch(ctx context.Context, db *gorm.DB, matches []*db_model.Match) error {
	if len(matches) == 0 {
		return nil
	}
	if err := db.WithContext(ctx).CreateInBatches(matches, 100).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r match) SaveMatchEntriesBatch(ctx context.Context, db *gorm.DB, entries []*db_model.MatchEntry) error {
	if len(entries) == 0 {
		return nil
	}
	if err := db.WithContext(ctx).CreateInBatches(entries, 100).Error; err != nil {
		return errors.Wrap(err)
	}
	return nil
}

func (r match) ListActiveMatchesByLocationID(ctx context.Context, db *gorm.DB, locationID string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	err := db.WithContext(ctx).
		Where("location_id = ? AND status IN ?", locationID, []string{"STANDBY", "ONGOING"}).
		Order("time ASC, id ASC").
		Find(&matches).Error
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}
