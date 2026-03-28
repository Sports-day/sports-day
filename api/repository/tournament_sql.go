package repository

import (
	"context"

	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
)

type tournamentRepository struct{}

func NewTournament() Tournament {
	return &tournamentRepository{}
}

// --- Tournament CRUD ---

func (r *tournamentRepository) Save(ctx context.Context, db *gorm.DB, tournament *db_model.Tournament) (*db_model.Tournament, error) {
	if err := db.WithContext(ctx).Save(tournament).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return tournament, nil
}

func (r *tournamentRepository) Get(ctx context.Context, db *gorm.DB, id string) (*db_model.Tournament, error) {
	var tournament db_model.Tournament
	if err := db.WithContext(ctx).First(&tournament, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &tournament, nil
}

func (r *tournamentRepository) Delete(ctx context.Context, db *gorm.DB, id string) (*db_model.Tournament, error) {
	var tournament db_model.Tournament
	if err := db.WithContext(ctx).First(&tournament, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.WithContext(ctx).Delete(&tournament).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &tournament, nil
}

func (r *tournamentRepository) List(ctx context.Context, db *gorm.DB) ([]*db_model.Tournament, error) {
	var tournaments []*db_model.Tournament
	if err := db.WithContext(ctx).Find(&tournaments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return tournaments, nil
}

func (r *tournamentRepository) BatchGet(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.Tournament, error) {
	var tournaments []*db_model.Tournament
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&tournaments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return tournaments, nil
}

func (r *tournamentRepository) ListByCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) ([]*db_model.Tournament, error) {
	var tournaments []*db_model.Tournament
	if err := db.WithContext(ctx).Where("competition_id = ?", competitionID).Order("display_order ASC").Find(&tournaments).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return tournaments, nil
}

func (r *tournamentRepository) GetMainByCompetitionID(ctx context.Context, db *gorm.DB, competitionID string) (*db_model.Tournament, error) {
	var tournament db_model.Tournament
	if err := db.WithContext(ctx).Where("competition_id = ? AND bracket_type = ?", competitionID, "MAIN").First(&tournament).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &tournament, nil
}

// --- TournamentSlot CRUD ---

func (r *tournamentRepository) SaveSlot(ctx context.Context, db *gorm.DB, slot *db_model.TournamentSlot) (*db_model.TournamentSlot, error) {
	if err := db.WithContext(ctx).Save(slot).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slot, nil
}

func (r *tournamentRepository) GetSlot(ctx context.Context, db *gorm.DB, id string) (*db_model.TournamentSlot, error) {
	var slot db_model.TournamentSlot
	if err := db.WithContext(ctx).First(&slot, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentSlotNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &slot, nil
}

func (r *tournamentRepository) DeleteSlot(ctx context.Context, db *gorm.DB, id string) (*db_model.TournamentSlot, error) {
	var slot db_model.TournamentSlot
	if err := db.WithContext(ctx).First(&slot, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentSlotNotFound
		}
		return nil, errors.Wrap(err)
	}
	if err := db.WithContext(ctx).Delete(&slot).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return &slot, nil
}

func (r *tournamentRepository) BatchGetSlots(ctx context.Context, db *gorm.DB, ids []string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("id IN ?", ids).Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}

func (r *tournamentRepository) ListByTournamentID(ctx context.Context, db *gorm.DB, tournamentID string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("tournament_id = ?", tournamentID).Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}

func (r *tournamentRepository) ListBySourceMatchID(ctx context.Context, db *gorm.DB, sourceMatchID string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("source_match_id = ?", sourceMatchID).Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}

func (r *tournamentRepository) GetByMatchEntryID(ctx context.Context, db *gorm.DB, matchEntryID string) (*db_model.TournamentSlot, error) {
	var slot db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("match_entry_id = ?", matchEntryID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentSlotNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &slot, nil
}

func (r *tournamentRepository) BatchGetByTournamentIDs(ctx context.Context, db *gorm.DB, tournamentIDs []string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("tournament_id IN ?", tournamentIDs).Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}

func (r *tournamentRepository) BatchGetByMatchEntryIDs(ctx context.Context, db *gorm.DB, matchEntryIDs []string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("match_entry_id IN ?", matchEntryIDs).Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}

func (r *tournamentRepository) GetSeedSlot(ctx context.Context, db *gorm.DB, tournamentID string, seedNumber int64) (*db_model.TournamentSlot, error) {
	var slot db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("tournament_id = ? AND source_type = ? AND seed_number = ?", tournamentID, "SEED", seedNumber).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrTournamentSlotNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &slot, nil
}

func (r *tournamentRepository) ListSeedSlotsByTournamentID(ctx context.Context, db *gorm.DB, tournamentID string) ([]*db_model.TournamentSlot, error) {
	var slots []*db_model.TournamentSlot
	if err := db.WithContext(ctx).Where("tournament_id = ? AND source_type = ?", tournamentID, "SEED").Order("seed_number ASC").Find(&slots).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return slots, nil
}
