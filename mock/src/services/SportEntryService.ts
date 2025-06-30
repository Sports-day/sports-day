import {
  SportEntry,
  CreateSportEntryInput,
  UpdateSportEntryInput,
} from "../models/SportEntry";
import { SportEntryRepository } from "../repositories/SportEntryRepository";

export class SportEntryService {
  private sportEntryRepo: SportEntryRepository;

  constructor(sportEntryRepo: SportEntryRepository) {
    this.sportEntryRepo = sportEntryRepo;
  }

  getAllSportEntries(): SportEntry[] {
    return this.sportEntryRepo.getAllSportEntries();
  }

  getSportEntryById(id: string): SportEntry | null {
    return this.sportEntryRepo.getSportEntryById(id);
  }

  getSportEntriesBySportSceneId(sportSceneId: string): SportEntry[] {
    return this.sportEntryRepo.getSportEntriesBySportSceneId(sportSceneId);
  }

  getSportEntriesByTeamId(teamId: string): SportEntry[] {
    return this.sportEntryRepo.getSportEntriesByTeamId(teamId);
  }

  createSportEntry(input: CreateSportEntryInput): SportEntry {
    return this.sportEntryRepo.createSportEntry(input);
  }

  updateSportEntry(
    id: string,
    input: UpdateSportEntryInput
  ): SportEntry | null {
    return this.sportEntryRepo.updateSportEntry(id, input);
  }

  deleteSportEntry(id: string): boolean {
    return this.sportEntryRepo.deleteSportEntry(id);
  }
}
