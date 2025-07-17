import { Sport, CreateSportInput, UpdateSportInput } from "../models/Sport";
import { SportRepository } from "../repositories/SportRepository";

export class SportService {
  private sportRepo: SportRepository;

  constructor(sportRepo: SportRepository) {
    this.sportRepo = sportRepo;
  }

  getAllSports(): Sport[] {
    return this.sportRepo.getAllSports();
  }

  getSportById(id: string): Sport | null {
    return this.sportRepo.getSportById(id);
  }

  createSport(input: CreateSportInput): Sport {
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
