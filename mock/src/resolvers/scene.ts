import { SceneService } from "../services/SceneService";

export const sceneResolvers = {
  Query: {
    scenes: (_: any, __: any, context: { sceneService: SceneService }) => {
      return context.sceneService.getAllScenes();
    },
    scene: (
      _: any,
      { id }: { id: string },
      context: { sceneService: SceneService }
    ) => {
      return context.sceneService.getSceneById(id);
    },
  },
  Mutation: {
    createScene: (
      _: any,
      { input }: { input: { name: string; description?: string } },
      context: { sceneService: SceneService }
    ) => {
      return context.sceneService.createScene(input);
    },
    updateScene: (
      _: any,
      {
        id,
        input,
      }: { id: string; input: { name?: string; description?: string } },
      context: { sceneService: SceneService }
    ) => {
      return context.sceneService.updateScene(id, input);
    },
    deleteScene: (
      _: any,
      { id }: { id: string },
      context: { sceneService: SceneService }
    ) => {
      return context.sceneService.deleteScene(id);
    },
  },
  Scene: {
    sports: (
      parent: { id: string },
      _: any,
      context: { sceneSportsLoader: any }
    ) => {
      return context.sceneSportsLoader.load(parent.id);
    },
  },
};
