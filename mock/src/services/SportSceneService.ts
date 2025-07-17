import {
  SportScene,
  CreateSportSceneInput,
  UpdateSportSceneInput,
} from "../models/SportScene";
import { SportSceneRepository } from "../repositories/SportSceneRepository";

export class SportSceneService {
  private sportSceneRepo: SportSceneRepository;

  constructor(sportSceneRepo: SportSceneRepository) {
    this.sportSceneRepo = sportSceneRepo;
  }

  getAllSportScenes(): SportScene[] {
    return this.sportSceneRepo.getAllSportScenes();
  }

  getSportSceneById(id: string): SportScene | null {
    return this.sportSceneRepo.getSportSceneById(id);
  }

  getSportScenesBySportId(sportId: string): SportScene[] {
    return this.sportSceneRepo.getSportScenesBySportId(sportId);
  }

  getSportScenesBySceneId(sceneId: string): SportScene[] {
    return this.sportSceneRepo.getSportScenesBySceneId(sceneId);
  }

  createSportScene(input: CreateSportSceneInput): SportScene {
    return this.sportSceneRepo.createSportScene(input);
  }

  updateSportScene(
    id: string,
    input: UpdateSportSceneInput
  ): SportScene | null {
    return this.sportSceneRepo.updateSportScene(id, input);
  }

  deleteSportScene(id: string): boolean {
    return this.sportSceneRepo.deleteSportScene(id);
  }
}
