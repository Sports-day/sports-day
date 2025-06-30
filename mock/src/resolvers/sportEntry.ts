import { SportEntryService } from "../services/SportEntryService";

export const sportEntryResolvers = {
  Query: {
    sportEntries: (
      _: any,
      __: any,
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.getAllSportEntries();
    },
    sportEntry: (
      _: any,
      { id }: { id: string },
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.getSportEntryById(id);
    },
  },
  Mutation: {
    createSportEntry: (
      _: any,
      { input }: { input: { sportSceneId: string; teamId: string } },
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.createSportEntry(input);
    },
    updateSportEntry: (
      _: any,
      {
        id,
        input,
      }: { id: string; input: { sportSceneId?: string; teamId?: string } },
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.updateSportEntry(id, input);
    },
    deleteSportEntry: (
      _: any,
      { id }: { id: string },
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.deleteSportEntry(id);
    },
  },
  SportEntry: {
    sportScene: (
      parent: { sportSceneId: string },
      _: any,
      context: { sportSceneService: any }
    ) => {
      return context.sportSceneService.getSportSceneById(parent.sportSceneId);
    },
    team: (
      parent: { teamId: string },
      _: any,
      context: { teamLoader: any }
    ) => {
      return context.teamLoader.load(parent.teamId);
    },
  },
};
