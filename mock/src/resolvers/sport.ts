import { SportService } from "../services/SportService";

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
      { input }: { input: { name: string; sceneId: string } },
      context: { sportService: SportService }
    ) => {
      return context.sportService.createSport(input);
    },
    updateSport: (
      _: any,
      { id, input }: { id: string; input: { name?: string; sceneId?: string } },
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
    scene: (
      parent: { sceneId: string },
      _: any,
      context: { sceneLoader: any }
    ) => {
      return context.sceneLoader.load(parent.sceneId);
    },
  },
};
