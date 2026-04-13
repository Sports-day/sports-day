"use client";

import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useGetSceneIdQuery, useGetSceneUsersQuery } from "@/gql/__generated__/graphql";

type HookResult = {
  items: SceneStatusItem[];
  loading: boolean;
  error: ApolloError | null;
};

export function useConflictedScenes(): HookResult {
  const { data: sceneData, loading: sceneLoading, error: sceneError } = useGetSceneIdQuery();
  const { data: sportSceneData, loading: sportSceneLoading, error: sportSceneError } =
    useGetSceneUsersQuery();

  const loading = sceneLoading || sportSceneLoading;
  const error = sceneError || sportSceneError || null;

  const items = useMemo(() => {
    const scenes = (sceneData?.scenes ?? []).filter((s) => !s.isDeleted);
    const sportScenes = sportSceneData?.scenes?.filter((s) => !s.isDeleted)?.flatMap((s) => s.sportScenes) ?? [];
    const sceneUserNamesMap = new Map<string, string[]>();

    sportScenes.forEach((sportScene) => {
      const sceneId = sportScene.scene?.id;
      if (!sceneId) return;
      const names =
        sportScene.entries?.flatMap((entry) =>
          entry.team?.users?.map((user) => user.name?.trim()).filter((n): n is string => !!n) ?? [],
        ) ?? [];
      if (!sceneUserNamesMap.has(sceneId)) {
        sceneUserNamesMap.set(sceneId, []);
      }
      sceneUserNamesMap.get(sceneId)?.push(...names);
    });

    return scenes.map((scene) => {
      const sceneUserNames = sceneUserNamesMap.get(scene.id) ?? [];
      const nameCount: Record<string, number> = {};
      sceneUserNames.forEach((name) => {
        nameCount[name] = (nameCount[name] || 0) + 1;
      });
      return {
        scenename: scene.name,
        users: Object.keys(nameCount).filter((name) => nameCount[name] > 1),
      };
    });
  }, [sceneData?.scenes, sportSceneData?.scenes]);

  return { items, loading, error };
}
