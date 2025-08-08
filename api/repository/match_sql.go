package repository

import (
	"context"
	"database/sql"

	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
)

type matchRepository struct{}

func NewMatch() Match {
	return &matchRepository{}
}

func (r *matchRepository) Save(ctx context.Context, db *gorm.DB, match *db_model.Match) (*db_model.Match, error) {
	if err := db.WithContext(ctx).Save(match).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return match, nil
}

func (r *matchRepository) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error) {
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

func (r *matchRepository) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Match, error) {
	var match db_model.Match
	if err := db.WithContext(ctx).First(&match, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &match, nil
}

func (r *matchRepository) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r *matchRepository) List(ctx context.Context, db *gorm.DB) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r *matchRepository) AddMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
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

		if err := db.WithContext(ctx).Create(entry).Error; err != nil {
			return nil, errors.Wrap(err)
		}
		entries = append(entries, entry)
	}
	return entries, nil
}

func (r *matchRepository) DeleteMatchEntries(ctx context.Context, db *gorm.DB, matchId string, teamIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id = ? AND team_id IN ?", matchId, teamIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	if err := db.WithContext(ctx).Where("match_id = ? AND team_id IN ?", matchId, teamIds).Delete(&db_model.MatchEntry{}).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r *matchRepository) UpdateMatchEntryScore(ctx context.Context, db *gorm.DB, matchId string, teamId string, score int) (*db_model.MatchEntry, error) {
	var entry db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id = ? AND team_id = ?", matchId, teamId).First(&entry).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrMatchNotFound
		}
		return nil, errors.Wrap(err)
	}

	if err := db.WithContext(ctx).Model(&db_model.MatchEntry{}).Where("match_id = ? AND team_id = ?", matchId, teamId).Update("score", score).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	var updated db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id = ? AND team_id = ?", matchId, teamId).First(&updated).Error; err != nil {
		return nil, errors.Wrap(err)
	}

	return &updated, nil

}

func (r *matchRepository) BatchGetMatchEntriesByTeamIDs(ctx context.Context, db *gorm.DB, teamIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("team_id IN ?", teamIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r *matchRepository) BatchGetMatchEntriesByMatchIDs(ctx context.Context, db *gorm.DB, matchIds []string) ([]*db_model.MatchEntry, error) {
	var entries []*db_model.MatchEntry
	if err := db.WithContext(ctx).Where("match_id IN ?", matchIds).Find(&entries).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return entries, nil
}

func (r *matchRepository) BatchGetMatchesByCompetitionIDs(ctx context.Context, db *gorm.DB, competitionIds []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("competition_id IN ?", competitionIds).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}

func (r *matchRepository) BatchGetMatchesByLocationIDs(ctx context.Context, db *gorm.DB, locationIds []string) ([]*db_model.Match, error) {
	var matches []*db_model.Match
	if err := db.WithContext(ctx).Where("location_id IN ?", locationIds).Find(&matches).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return matches, nil
}
