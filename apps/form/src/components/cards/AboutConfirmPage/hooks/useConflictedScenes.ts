"use client";

import { useMemo } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import {
  GET_SCENE_ID,
  GET_SCENE_USERS,
} from "@/components/cards/AboutConfirmPage/hooks/aboutConfirm.gql";

type HookResult = {
  items: SceneStatusItem[];
  loading: boolean;
  error: ApolloError | null;
};

export function useConflictedScenes(): HookResult {
  const { data: sceneData, loading: sceneLoading, error: sceneError } = useQuery(GET_SCENE_ID);
  const { data: sportSceneData, loading: sportSceneLoading, error: sportSceneError } =
    useQuery(GET_SCENE_USERS);

  const loading = sceneLoading || sportSceneLoading;
  const error = sceneError || sportSceneError || null;

  const items = useMemo(() => {
    const scenes = sceneData?.scenes ?? [];
    const sportScenes = sportSceneData?.scenes?.flatMap((s: any) => s.sportScenes) ?? [];
    const sceneUserNamesMap = new Map<string, string[]>();

    sportScenes.forEach((sportScene: any) => {
      const sceneId = sportScene.scene?.id;
      if (!sceneId) return;
      const names =
        sportScene.entries?.flatMap((entry: any) =>
          entry.team?.users?.map((user: any) => user.name?.trim()).filter(Boolean) ?? [],
        ) ?? [];
      if (!sceneUserNamesMap.has(sceneId)) {
        sceneUserNamesMap.set(sceneId, []);
      }
      sceneUserNamesMap.get(sceneId)?.push(...names);
    });

    return scenes.map((scene: any) => {
      const sceneUserNames = sceneUserNamesMap.get(scene.id) ?? [];
      const nameCount: Record<string, number> = {};
      sceneUserNames.forEach((name: string) => {
        nameCount[name] = (nameCount[name] || 0) + 1;
      });
      return {
        scenename: scene.name,
        users: Object.keys(nameCount).filter((name: string) => nameCount[name] > 1),
      };
    });
  }, [sceneData?.scenes, sportSceneData?.scenes]);

  return { items, loading, error };
}
