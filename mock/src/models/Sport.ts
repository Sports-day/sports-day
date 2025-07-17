import { Scene } from "./Scene";

export interface Sport {
  id: string;
  name: string;
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSportInput {
  name: string;
}

export interface UpdateSportInput {
  name?: string;
}
