"use client";

import { useMemo } from "react";
import { ApolloError, useQuery } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import {
  GET_ALL_USERS,
  GET_SCENE_ID,
  GET_SCENE_USERS,
} from "@/components/cards/AboutConfirmPage/hooks/aboutConfirm.gql";

type HookResult = {
  items: SceneStatusItem[];
  loading: boolean;
  error: ApolloError | null;
};

export function useNotSelectedScenes(): HookResult {
  const { data: sceneData, loading: sceneLoading, error: sceneError } = useQuery(GET_SCENE_ID);
  const { data: sportSceneData, loading: sportSceneLoading, error: sportSceneError } =
    useQuery(GET_SCENE_USERS);
  const { data: allUserData, loading: allUsersLoading, error: allUsersError } =
    useQuery(GET_ALL_USERS);

  const loading = sceneLoading || sportSceneLoading || allUsersLoading;
  const error = sceneError || sportSceneError || allUsersError || null;

  const items = useMemo(() => {
    const allUsers =
      allUserData?.users?.map((d: any) => ({
        id: d.id?.trim(),
        name: d.name?.trim(),
      })) ?? [];
    const scenes = sceneData?.scenes ?? [];
    const sportScenes = sportSceneData?.sportScenes ?? [];

    const sceneTeamUserIdMap = new Map<string, Set<string>>();
    sportScenes.forEach((sportScene: any) => {
      const sceneId = sportScene.scene?.id;
      if (!sceneId) return;
      const ids =
        sportScene.entries?.flatMap((entry: any) =>
          entry.team?.users?.map((user: any) => user.id?.trim()).filter(Boolean) ?? [],
        ) ?? [];
      if (!sceneTeamUserIdMap.has(sceneId)) {
        sceneTeamUserIdMap.set(sceneId, new Set());
      }
      const userSet = sceneTeamUserIdMap.get(sceneId);
      ids.forEach((id: string) => userSet?.add(id));
    });

    return scenes.map((scene: any) => {
      const assignedUserIds = sceneTeamUserIdMap.get(scene.id) ?? new Set<string>();
      return {
        scenename: scene.name,
        users: allUsers
          .filter((user: { id: string; name: string }) => !assignedUserIds.has(user.id))
          .map((user: { id: string; name: string }) => user.name),
      };
    });
  }, [allUserData?.users, sceneData?.scenes, sportSceneData?.sportScenes]);

  return { items, loading, error };
}
