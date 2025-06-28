export interface Sport {
  id: string;
  name: string;
  sceneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSportInput {
  name: string;
  sceneId: string;
}

export interface UpdateSportInput {
  name?: string;
  sceneId?: string;
}
