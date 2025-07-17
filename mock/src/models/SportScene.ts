export interface SportScene {
  id: string;
  sportId: string;
  sceneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSportSceneInput {
  sportId: string;
  sceneId: string;
}

export interface UpdateSportSceneInput {
  sportId?: string;
  sceneId?: string;
}
