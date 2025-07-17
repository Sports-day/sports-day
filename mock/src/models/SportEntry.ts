export interface SportEntry {
  id: string;
  sportSceneId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSportEntryInput {
  sportSceneId: string;
  teamId: string;
}

export interface UpdateSportEntryInput {
  sportSceneId?: string;
  teamId?: string;
}
