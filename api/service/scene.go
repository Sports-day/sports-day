package service

import (
	"context"

	mysqlDriver "github.com/go-sql-driver/mysql"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"gorm.io/gorm"
)

type Scene struct {
	db        *gorm.DB
	sceneRepo repository.Scene
}

func NewScene(db *gorm.DB, sceneRepo repository.Scene) Scene {
	return Scene{
		db:        db,
		sceneRepo: sceneRepo,
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
	linkedScenes, err := s.sceneRepo.FindSportSceneBySceneID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if len(linkedScenes) > 0 {
		return nil, errors.ErrSceneCannotDelete
	}
	return s.sceneRepo.Delete(ctx, s.db, id)
}

func (s *Scene) CreateSportScene(ctx context.Context, input *model.CreateSportSceneInput) (*db_model.SportScene, error) {
	exists, err := s.sceneRepo.ExistsSportScene(ctx, s.db, input.SportID, input.SceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if exists {
		return nil, errors.ErrSportSceneAlreadyExists
	}

	sportScene := &db_model.SportScene{
		ID:      ulid.Make(),
		SportID: input.SportID,
		SceneID: input.SceneID,
	}
	created, err := s.sceneRepo.CreateSportScene(ctx, s.db, sportScene)
	if err != nil {
		if isDuplicateKeyError(err) {
			return nil, errors.ErrSportSceneAlreadyExists.WithError(err)
		}
		return nil, errors.Wrap(err)
	}
	return created, nil
}

func (s *Scene) FindSportSceneByID(ctx context.Context, id string) (*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.FindSportSceneByID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}
func (s *Scene) FindSportSceneBySportID(ctx context.Context, sportID string) ([]*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.FindSportSceneBySportID(ctx, s.db, sportID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportScene, nil
}
func (s *Scene) FindSportSceneBySceneID(ctx context.Context, sceneID string) ([]*db_model.SportScene, error) {
	sportScene, err := s.sceneRepo.FindSportSceneBySceneID(ctx, s.db, sceneID)
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

func (s *Scene) CreateSportEntry(ctx context.Context, input *model.CreateSportEntryInput) (*db_model.SportEntry, error) {
	exists, err := s.sceneRepo.ExistsSportEntry(ctx, s.db, input.SportSceneID, input.TeamID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	if exists {
		return nil, errors.ErrSportEntryAlreadyExists
	}

	sportEntry := &db_model.SportEntry{
		ID:           ulid.Make(),
		SportSceneID: input.SportSceneID,
		TeamID:       input.TeamID,
	}
	created, err := s.sceneRepo.CreateSportEntry(ctx, s.db, sportEntry)
	if err != nil {
		if isDuplicateKeyError(err) {
			return nil, errors.ErrSportEntryAlreadyExists.WithError(err)
		}
		return nil, errors.Wrap(err)
	}
	return created, nil
}

func (s *Scene) FindSportEntryByID(ctx context.Context, id string) (*db_model.SportEntry, error) {
	sportEntry, err := s.sceneRepo.FindSportEntryByID(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntry, nil
}
func (s *Scene) FindSportEntryBySportSceneID(ctx context.Context, sportSceneID string) ([]*db_model.SportEntry, error) {
	sportEntry, err := s.sceneRepo.FindSportEntryBySportSceneID(ctx, s.db, sportSceneID)
	if err != nil {
		return nil, errors.Wrap(err)
	}
	return sportEntry, nil
}
func (s *Scene) FindSportEntryByTeamID(ctx context.Context, teamID string) ([]*db_model.SportEntry, error) {
	sportEntry, err := s.sceneRepo.FindSportEntryByTeamID(ctx, s.db, teamID)
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

func isDuplicateKeyError(err error) bool {
	var mysqlErr *mysqlDriver.MySQLError
	if errors.As(err, &mysqlErr) {
		return mysqlErr.Number == 1062
	}
	return false
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
