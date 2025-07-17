import { SportSceneService } from "../services/SportSceneService";
import { SportEntryService } from "../services/SportEntryService";

export const sportSceneResolvers = {
  Query: {
    sportScenes: (
      _: any,
      __: any,
      context: { sportSceneService: SportSceneService }
    ) => {
      return context.sportSceneService.getAllSportScenes();
    },
    sportScene: (
      _: any,
      { id }: { id: string },
      context: { sportSceneService: SportSceneService }
    ) => {
      return context.sportSceneService.getSportSceneById(id);
    },
  },
  Mutation: {
    createSportScene: (
      _: any,
      { input }: { input: { sportId: string; sceneId: string } },
      context: { sportSceneService: SportSceneService }
    ) => {
      return context.sportSceneService.createSportScene(input);
    },
    updateSportScene: (
      _: any,
      {
        id,
        input,
      }: { id: string; input: { sportId?: string; sceneId?: string } },
      context: { sportSceneService: SportSceneService }
    ) => {
      return context.sportSceneService.updateSportScene(id, input);
    },
    deleteSportScene: (
      _: any,
      { id }: { id: string },
      context: { sportSceneService: SportSceneService }
    ) => {
      return context.sportSceneService.deleteSportScene(id);
    },
  },
  SportScene: {
    sport: (
      parent: { sportId: string },
      _: any,
      context: { sportLoader: any }
    ) => {
      return context.sportLoader.load(parent.sportId);
    },
    scene: (
      parent: { sceneId: string },
      _: any,
      context: { sceneLoader: any }
    ) => {
      return context.sceneLoader.load(parent.sceneId);
    },
    entries: (
      parent: { id: string },
      _: any,
      context: { sportEntryService: SportEntryService }
    ) => {
      return context.sportEntryService.getSportEntriesBySportSceneId(parent.id);
    },
  },
};
