import { Scene, CreateSceneInput, UpdateSceneInput } from "../models/Scene";
import { SceneRepository } from "../repositories/SceneRepository";

export class SceneService {
  private sceneRepo: SceneRepository;

  constructor(sceneRepo: SceneRepository) {
    this.sceneRepo = sceneRepo;
  }

  getAllScenes(): Scene[] {
    return this.sceneRepo.getAllScenes();
  }

  getSceneById(id: string): Scene | null {
    if (!id) {
      throw new Error("Scene ID is required");
    }
    return this.sceneRepo.getSceneById(id);
  }

  createScene(input: CreateSceneInput): Scene {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Scene name is required");
    }

    if (input.name.length > 100) {
      throw new Error("Scene name must be 100 characters or less");
    }

    if (input.description && input.description.length > 500) {
      throw new Error("Scene description must be 500 characters or less");
    }

    return this.sceneRepo.createScene({
      name: input.name.trim(),
      description: input.description?.trim(),
    });
  }

  updateScene(id: string, input: UpdateSceneInput): Scene {
    if (!id) {
      throw new Error("Scene ID is required");
    }

    const existingScene = this.sceneRepo.getSceneById(id);
    if (!existingScene) {
      throw new Error("Scene not found");
    }

    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        throw new Error("Scene name cannot be empty");
      }
      if (input.name.length > 100) {
        throw new Error("Scene name must be 100 characters or less");
      }
    }

    if (
      input.description !== undefined &&
      input.description &&
      input.description.length > 500
    ) {
      throw new Error("Scene description must be 500 characters or less");
    }

    const updatedScene = this.sceneRepo.updateScene(id, {
      name: input.name?.trim(),
      description: input.description?.trim(),
    });

    if (!updatedScene) {
      throw new Error("Failed to update scene");
    }

    return updatedScene;
  }

  deleteScene(id: string): boolean {
    if (!id) {
      throw new Error("Scene ID is required");
    }

    const existingScene = this.sceneRepo.getSceneById(id);
    if (!existingScene) {
      throw new Error("Scene not found");
    }

    return this.sceneRepo.deleteScene(id);
  }
}
