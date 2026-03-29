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
            name
          }
        }
      }
    }
  }
`;

export function useConflictedScenes(): SceneStatusItem[] {
  const { data: sceneData } = useQuery(GET_SCENE_ID);
  const { data: sportSceneData } = useQuery(GET_SCENE_USERS);

  const scenes = sceneData?.scenes ?? [];

  return scenes.map((scene: any) => {
    const targetSportScenes =
      sportSceneData?.sportScenes?.filter((e: any) => e.scene?.id === scene.id) || [];

    const sceneTeamUsers = targetSportScenes
      .flatMap((d: any) =>
        d.entries?.flatMap((s: any) => s.team?.users?.map((u: any) => u.name) || []),
      )
      .filter(Boolean);

    const nameCount: Record<string, number> = {};
    sceneTeamUsers.forEach((name: string) => {
      nameCount[name] = (nameCount[name] || 0) + 1;
    });

    return {
      scenename: scene.name,
      users: Object.keys(nameCount).filter((name: string) => nameCount[name] > 1),
    };
  });
}
