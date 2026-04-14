"use client";

import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import { useGetSceneIdQuery, useGetSceneUsersQuery } from "@/gql/__generated__/graphql";
import { useMsGraphUsers } from "@/hooks/useMsGraphUsers";

type HookResult = {
  items: SceneStatusItem[];
  loading: boolean;
  error: ApolloError | null;
};

export function useConflictedScenes(): HookResult {
  const { data: sceneData, loading: sceneLoading, error: sceneError } = useGetSceneIdQuery({ fetchPolicy: "cache-and-network" });
  const { data: sportSceneData, loading: sportSceneLoading, error: sportSceneError } =
    useGetSceneUsersQuery({ fetchPolicy: "cache-and-network" });

  const allUserMsIds = useMemo(() => {
    const sportScenes = sportSceneData?.scenes?.filter((s) => !s.isDeleted)?.flatMap((s) => s.sportScenes) ?? [];
    return sportScenes
      .flatMap((ss) => ss.entries ?? [])
      .flatMap((e) => e.team?.users ?? [])
      .map((u) => u.identify?.microsoftUserId)
      .filter((id): id is string => !!id);
  }, [sportSceneData?.scenes]);
  const { msGraphUsers, loading: msGraphLoading } = useMsGraphUsers(allUserMsIds);

  const loading = sceneLoading || sportSceneLoading || msGraphLoading;
  const error = sceneError || sportSceneError || null;

  const items = useMemo(() => {
    const scenes = (sceneData?.scenes ?? []).filter((s) => !s.isDeleted);
    const sportScenes = sportSceneData?.scenes?.filter((s) => !s.isDeleted)?.flatMap((s) => s.sportScenes) ?? [];

    // userId -> 表示名のマップを構築
    const userIdToName = new Map<string, string>();
    sportScenes
      .flatMap((ss) => ss.entries ?? [])
      .flatMap((e) => e.team?.users ?? [])
      .forEach((user) => {
        if (userIdToName.has(user.id)) return;
        const msUser = user.identify?.microsoftUserId ? msGraphUsers.get(user.identify.microsoftUserId) : undefined;
        const name = (msUser?.displayName ?? user.name)?.trim();
        if (name) userIdToName.set(user.id, name);
      });

    // sceneId -> userId[] のマップを構築（IDベースで重複検出）
    const sceneUserIdsMap = new Map<string, string[]>();
    sportScenes.forEach((sportScene) => {
      const sceneId = sportScene.scene?.id;
      if (!sceneId) return;
      const ids =
        sportScene.entries?.flatMap((entry) =>
          entry.team?.users?.map((user) => user.id).filter((id): id is string => !!id) ?? [],
        ) ?? [];
      if (!sceneUserIdsMap.has(sceneId)) {
        sceneUserIdsMap.set(sceneId, []);
      }
      sceneUserIdsMap.get(sceneId)?.push(...ids);
    });

    return scenes.map((scene) => {
      const sceneUserIds = sceneUserIdsMap.get(scene.id) ?? [];
      const idCount: Record<string, number> = {};
      sceneUserIds.forEach((id) => {
        idCount[id] = (idCount[id] || 0) + 1;
      });
      const conflictedIds = Object.keys(idCount).filter((id) => idCount[id] > 1);
      return {
        scenename: scene.name,
        users: conflictedIds.map((id) => userIdToName.get(id) ?? id),
      };
    });
  }, [sceneData?.scenes, sportSceneData?.scenes, msGraphUsers]);

  return { items, loading, error };
}
