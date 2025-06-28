import { Sport, CreateSportInput, UpdateSportInput } from "../models/Sport";
import { SportRepository } from "../repositories/SportRepository";
import { SceneRepository } from "../repositories/SceneRepository";

export class SportService {
  private sportRepo: SportRepository;
  private sceneRepo: SceneRepository;

  constructor(sportRepo: SportRepository, sceneRepo: SceneRepository) {
    this.sportRepo = sportRepo;
    this.sceneRepo = sceneRepo;
  }

  getAllSports(): Sport[] {
    return this.sportRepo.getAllSports();
  }

  getSportById(id: string): Sport | null {
    return this.sportRepo.getSportById(id);
  }

  getSportsBySceneId(sceneId: string): Sport[] {
    // Sceneの存在確認
    const scene = this.sceneRepo.getSceneById(sceneId);
    if (!scene) {
      throw new Error(`Scene with id ${sceneId} not found`);
    }
    return this.sportRepo.getSportsBySceneId(sceneId);
  }

  createSport(input: CreateSportInput): Sport {
    // Sceneの存在確認
    const scene = this.sceneRepo.getSceneById(input.sceneId);
    if (!scene) {
      throw new Error(`Scene with id ${input.sceneId} not found`);
    }

    // 名前のバリデーション
    if (!input.name.trim()) {
      throw new Error("Sport name cannot be empty");
    }

    return this.sportRepo.createSport(input);
  }

  updateSport(id: string, input: UpdateSportInput): Sport | null {
    const existing = this.sportRepo.getSportById(id);
    if (!existing) {
      throw new Error(`Sport with id ${id} not found`);
    }

    // Sceneの存在確認（sceneIdが更新される場合）
    if (input.sceneId) {
      const scene = this.sceneRepo.getSceneById(input.sceneId);
      if (!scene) {
        throw new Error(`Scene with id ${input.sceneId} not found`);
      }
    }

    // 名前のバリデーション
    if (input.name !== undefined && !input.name.trim()) {
      throw new Error("Sport name cannot be empty");
    }

    return this.sportRepo.updateSport(id, input);
  }

  deleteSport(id: string): boolean {
    const existing = this.sportRepo.getSportById(id);
    if (!existing) {
      throw new Error(`Sport with id ${id} not found`);
    }

    return this.sportRepo.deleteSport(id);
  }
}
