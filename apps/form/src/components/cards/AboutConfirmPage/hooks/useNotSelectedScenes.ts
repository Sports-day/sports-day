"use client";

import { gql, useQuery } from "@apollo/client";
import { SceneStatusItem } from "@/components/cards/AboutConfirmPage/SceneStatusCardLayout";

const GET_SCENE_ID = gql`
  query GetSceneId {
    scenes {
      id
      name
    }
  }
`;

const GET_SCENE_USERS = gql`
  query GetSceneUsers {
    sportScenes {
      scene {
        id
      }
      entries {
        team {
          users {
            id
          }
        }
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
    }
  }
`;

export function useNotSelectedScenes(): SceneStatusItem[] {
  const { data: sceneData } = useQuery(GET_SCENE_ID);
  const { data: sportSceneData } = useQuery(GET_SCENE_USERS);
  const { data: allUserData } = useQuery(GET_ALL_USERS);

  const allUsers =
    allUserData?.users?.map((d: any) => ({
      id: d.id?.trim(),
      name: d.name?.trim(),
    })) || [];

  const scenes = sceneData?.scenes ?? [];

  return scenes.map((scene: any) => {
    const targetSportScenes =
      sportSceneData?.sportScenes?.filter((e: any) => e.scene?.id === scene.id) || [];

    const sceneTeamUserIds = targetSportScenes.flatMap((d: any) =>
      d.entries?.flatMap((s: any) => s.team?.users?.map((u: any) => u.id) || []),
    );

    return {
      scenename: scene.name,
      users: allUsers
        .filter((user: { id: string; name: string }) => !sceneTeamUserIds.includes(user.id))
        .map((user: { id: string; name: string }) => user.name),
    };
  });
}
