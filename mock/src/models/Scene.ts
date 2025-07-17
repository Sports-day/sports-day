export interface Scene {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSceneInput {
  name: string;
  description?: string;
}

export interface UpdateSceneInput {
  name?: string;
  description?: string;
}
