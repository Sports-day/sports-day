import { SportService } from "../services/SportService";
import { SportSceneService } from "../services/SportSceneService";

export const sportResolvers = {
  Query: {
    sports: (_: any, __: any, context: { sportService: SportService }) => {
      return context.sportService.getAllSports();
    },
    sport: (
      _: any,
      { id }: { id: string },
      context: { sportService: SportService }
    ) => {
      return context.sportService.getSportById(id);
    },
  },

  Mutation: {
    createSport: (
      _: any,
      { input }: { input: { name: string } },
      context: { sportService: SportService }
    ) => {
      return context.sportService.createSport(input);
    },
    updateSport: (
      _: any,
      { id, input }: { id: string; input: { name?: string } },
      context: { sportService: SportService }
    ) => {
      return context.sportService.updateSport(id, input);
    },
    deleteSport: (
      _: any,
      { id }: { id: string },
      context: { sportService: SportService }
    ) => {
      return context.sportService.deleteSport(id);
    },
  },

  Sport: {
    scenes: (
      parent: { id: string },
      _: any,
      context: { sportSceneService: SportSceneService; sceneLoader: any }
    ) => {
      const sportScenes = context.sportSceneService.getSportScenesBySportId(
        parent.id
      );
      return sportScenes.map((sportScene) =>
        context.sceneLoader.load(sportScene.sceneId)
      );
    },
  },
};
