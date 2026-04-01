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

type Scene struct {
	db             *gorm.DB
	sceneRepo      repository.Scene
	competitionSvc *Competition
}

func NewScene(db *gorm.DB, sceneRepo repository.Scene, competitionSvc *Competition) Scene {
	return Scene{
		db:             db,
		sceneRepo:      sceneRepo,
		competitionSvc: competitionSvc,
	}
}

func (s *Scene) Get(ctx context.Context, id string) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return scene, nil
}

func (s *Scene) List(ctx context.Context) ([]*db_model.Scene, error) {
	scenes, err := s.sceneRepo.List(ctx, s.db)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return scenes, nil
}

func (s *Scene) Create(ctx context.Context, input *model.CreateSceneInput) (*db_model.Scene, error) {
	scene := &db_model.Scene{
		ID:   ulid.Make(),
		Name: input.Name,
	}
	created, err := s.sceneRepo.Save(ctx, s.db, scene)
	if err != nil {
		return nil, errors.ErrSaveScene
	}
	return created, nil
}

func (s *Scene) Update(ctx context.Context, id string, input *model.UpdateSceneInput) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if input.Name != nil {
		scene.Name = *input.Name
	}

	updated, err := s.sceneRepo.Save(ctx, s.db, scene)
	if err != nil {
		return nil, errors.ErrSaveScene
	}
	return updated, nil
}

func (s *Scene) Delete(ctx context.Context, id string) (*db_model.Scene, error) {
	linkedScenes, err := s.sceneRepo.GetSportSceneBySceneID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if len(linkedScenes) > 0 {
		return nil, errors.ErrSceneCannotDelete
	}
	linkedCompetitions, err := s.competitionSvc.FindBySceneID(ctx, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if len(linkedCompetitions) > 0 {
		return nil, errors.ErrSceneCannotDeleteByCompetition
	}
	return s.sceneRepo.Delete(ctx, s.db, id)
}

func (s *Scene) AddSportScenes(ctx context.Context, sceneID string, sportIDs []string) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, sceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if _, err := s.sceneRepo.AddSportScenes(ctx, s.db, sceneID, sportIDs); err != nil {
		return nil, errors.Wrap(err)
	}

	return scene, nil
}

func (s *Scene) DeleteSportScenes(ctx context.Context, sceneID string, sportIDs []string) (*db_model.Scene, error) {
	scene, err := s.sceneRepo.Get(ctx, s.db, sceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if err := s.sceneRepo.DeleteSportScenes(ctx, s.db, sceneID, sportIDs); err != nil {
		return nil, errors.Wrap(err)
	}

	return scene, nil
}

func (s *Scene) AddSportEntries(ctx context.Context, sportSceneID string, teamIDs []string) (*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.GetSportSceneByID(ctx, s.db, sportSceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if _, err := s.sceneRepo.AddSportEntries(ctx, s.db, sportSceneID, teamIDs); err != nil {
		return nil, errors.Wrap(err)
	}

	return sportScene, nil
}

func (s *Scene) DeleteSportEntries(ctx context.Context, sportSceneID string, teamIDs []string) (*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.GetSportSceneByID(ctx, s.db, sportSceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	if err := s.sceneRepo.DeleteSportEntries(ctx, s.db, sportSceneID, teamIDs); err != nil {
		return nil, errors.Wrap(err)
	}

	return sportScene, nil
}

func (s *Scene) GetSportSceneByID(ctx context.Context, id string) (*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.GetSportSceneByID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}

func (s *Scene) GetSportSceneBySportID(ctx context.Context, sportID string) ([]*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.GetSportSceneBySportID(ctx, s.db, sportID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}

func (s *Scene) GetSportSceneBySceneID(ctx context.Context, sceneID string) ([]*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.GetSportSceneBySceneID(ctx, s.db, sceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}

func (s *Scene) DeleteSportScene(ctx context.Context, id string) (*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.DeleteSportScene(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}

func (s *Scene) GetSportEntryByID(ctx context.Context, id string) (*db_model.SportEntry, error) {
	sportEntry, err := s.sceneRepo.GetSportEntryByID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntry, nil
}

func (s *Scene) DeleteSportEntry(ctx context.Context, id string) (*db_model.SportEntry, error) {
	sportEntry, err := s.sceneRepo.DeleteSportEntry(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntry, nil
}

func (s *Scene) GetSportScenesMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.SportScene, error) {
	sportScenes, err := s.sceneRepo.BatchGetSportScenesByIDs(ctx, s.db, ids)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportSceneMap := make(map[string]*db_model.SportScene)
	for _, sportScene := range sportScenes {
		sportSceneMap[sportScene.ID] = sportScene
	}
	return sportSceneMap, nil
}

func (s *Scene) GetSportScenesMapBySportIDs(ctx context.Context, sportIDs []string) (map[string][]*db_model.SportScene, error) {
	sportScenes, err := s.sceneRepo.BatchGetSportScenesBySportIDs(ctx, s.db, sportIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportScenesMap := make(map[string][]*db_model.SportScene)
	for _, sportScene := range sportScenes {
		sportScenesMap[sportScene.SportID] = append(sportScenesMap[sportScene.SportID], sportScene)
	}
	return sportScenesMap, nil
}

func (s *Scene) GetSportScenesMapBySceneIDs(ctx context.Context, sceneIDs []string) (map[string][]*db_model.SportScene, error) {
	sportScenes, err := s.sceneRepo.BatchGetSportScenesBySceneIDs(ctx, s.db, sceneIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportScenesMap := make(map[string][]*db_model.SportScene)
	for _, sportScene := range sportScenes {
		sportScenesMap[sportScene.SceneID] = append(sportScenesMap[sportScene.SceneID], sportScene)
	}
	return sportScenesMap, nil
}

func (s *Scene) GetSportEntriesMapBySportSceneIDs(ctx context.Context, sportSceneIDs []string) (map[string][]*db_model.SportEntry, error) {
	sportEntries, err := s.sceneRepo.BatchGetSportEntriesBySportSceneIDs(ctx, s.db, sportSceneIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportEntriesMap := make(map[string][]*db_model.SportEntry)
	for _, sportEntry := range sportEntries {
		sportEntriesMap[sportEntry.SportSceneID] = append(sportEntriesMap[sportEntry.SportSceneID], sportEntry)
	}
	return sportEntriesMap, nil
}

func (s *Scene) GetSportEntriesMapByTeamIDs(ctx context.Context, teamIDs []string) (map[string][]*db_model.SportEntry, error) {
	sportEntries, err := s.sceneRepo.BatchGetSportEntriesByTeamIDs(ctx, s.db, teamIDs)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sportEntriesMap := make(map[string][]*db_model.SportEntry)
	for _, sportEntry := range sportEntries {
		sportEntriesMap[sportEntry.TeamID] = append(sportEntriesMap[sportEntry.TeamID], sportEntry)
	}
	return sportEntriesMap, nil
}

func (s *Scene) GetScenesMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.Scene, error) {
	scenes, err := s.sceneRepo.BatchGetScenesByIDs(ctx, s.db, ids)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	sceneMap := make(map[string]*db_model.Scene)
	for _, sc := range scenes {
		sceneMap[sc.ID] = sc
	}
	return sceneMap, nil
}
