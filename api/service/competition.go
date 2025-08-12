package service

import (
	"context"

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
}

func NewCompetition(db *gorm.DB, competitionRepository repository.Competition, teamRepository repository.Team, leagueRepository repository.League) Competition {
	return Competition{
		db:                    db,
		competitionRepository: competitionRepository,
		teamRepository:        teamRepository,
		leagueRepository:      leagueRepository,
	}
}

func (s *Competition) Create(ctx context.Context, input *model.CreateCompetitionInput) (*db_model.Competition, error) {
	competition := &db_model.Competition{
		ID:   ulid.Make(),
		Name: input.Name,
		Type: "TOURNAMENT",
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
	competition, err := s.competitionRepository.Get(ctx, s.db, competitionId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrCompetitionNotFound
		}
		return nil, errors.Wrap(err)
	}

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if _, err := s.competitionRepository.AddCompetitionEntries(ctx, tx, competitionId, teamIds); err != nil {
			return err
		}

		if competition.Type == "LEAGUE" {
			for _, teamId := range teamIds {
				standing := &db_model.LeagueStanding{
					ID:     competitionId,
					TeamID: teamId,
				}
				if _, err := s.leagueRepository.SaveStanding(ctx, tx, standing); err != nil {
					return err
				}
			}
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
func (s *Competition) GetCompetitionMapByLocationIDs(ctx context.Context, locationIds []string) (map[string][]*db_model.Competition, error) {
	competitions, err := s.competitionRepository.BatchGetByLocationIDs(ctx, s.db, locationIds)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	competitionsMap := make(map[string][]*db_model.Competition, len(locationIds))
	for _, id := range locationIds {
		competitionsMap[id] = []*db_model.Competition{}
	}

	for _, comp := range competitions {
		if !comp.DefaultLocationID.Valid {
			continue
		}

		locID := comp.DefaultLocationID.String

		if _, ok := competitionsMap[locID]; ok {
			competitionsMap[locID] = append(competitionsMap[locID], comp)
		}
	}
	return competitionsMap, nil
}
