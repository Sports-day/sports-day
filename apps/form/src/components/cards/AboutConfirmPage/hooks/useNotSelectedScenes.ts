"use client";

import { useMemo } from "react";
import { ApolloError } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";
import {
  useGetAllUsersQuery,
  useGetSceneIdQuery,
  useGetSceneUsersQuery,
} from "@/gql/__generated__/graphql";
import { useMsGraphUsers } from "@/hooks/useMsGraphUsers";

type HookResult = {
  items: SceneStatusItem[];
  loading: boolean;
  error: ApolloError | null;
};

export function useNotSelectedScenes(): HookResult {
  const { data: sceneData, loading: sceneLoading, error: sceneError } = useGetSceneIdQuery();
  const { data: sportSceneData, loading: sportSceneLoading, error: sportSceneError } =
    useGetSceneUsersQuery();
  const { data: allUserData, loading: allUsersLoading, error: allUsersError } =
    useGetAllUsersQuery();

  const allUserMsIds = useMemo(() => {
    return (allUserData?.users ?? [])
      .map((u) => u.identify?.microsoftUserId)
      .filter((id): id is string => !!id);
  }, [allUserData?.users]);
  const { msGraphUsers, loading: msGraphLoading } = useMsGraphUsers(allUserMsIds);

  const loading = sceneLoading || sportSceneLoading || allUsersLoading || msGraphLoading;
  const error = sceneError || sportSceneError || allUsersError || null;

  const items = useMemo(() => {
    const allUsers =
      allUserData?.users?.map((d) => {
        const msUser = d.identify?.microsoftUserId ? msGraphUsers.get(d.identify.microsoftUserId) : undefined;
        return {
          id: d.id?.trim(),
          name: (msUser?.displayName ?? d.name)?.trim(),
        };
      }) ?? [];
    const scenes = (sceneData?.scenes ?? []).filter((s) => !s.isDeleted);
    const sportScenes = sportSceneData?.scenes?.filter((s) => !s.isDeleted)?.flatMap((s) => s.sportScenes) ?? [];

    const sceneTeamUserIdMap = new Map<string, Set<string>>();
    sportScenes.forEach((sportScene) => {
      const sceneId = sportScene.scene?.id;
      if (!sceneId) return;
      const ids =
        sportScene.entries?.flatMap((entry) =>
          entry.team?.users?.map((user) => user.id?.trim()).filter(Boolean) ?? [],
        ) ?? [];
      if (!sceneTeamUserIdMap.has(sceneId)) {
        sceneTeamUserIdMap.set(sceneId, new Set());
      }
      const userSet = sceneTeamUserIdMap.get(sceneId);
      ids.forEach((id) => userSet?.add(id));
    });

    return scenes.map((scene) => {
      const assignedUserIds = sceneTeamUserIdMap.get(scene.id) ?? new Set<string>();
      return {
        scenename: scene.name,
        users: allUsers
          .filter((user) => !assignedUserIds.has(user.id))
          .map((user) => user.name ?? ''),
      };
    });
  }, [allUserData?.users, sceneData?.scenes, sportSceneData?.scenes, msGraphUsers]);

  return { items, loading, error };
}
