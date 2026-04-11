"use client";

import { gql } from "@apollo/client";

export const GET_SCENE_ID = gql`
  query GetSceneId {
    scenes {
      id
      name
      isDeleted
    }
  }
`;

export const GET_SCENE_USERS = gql`
  query GetSceneUsers {
    scenes {
      isDeleted
      sportScenes {
        scene {
          id
        }
        entries {
          team {
            users {
              id
              name
              identify { microsoftUserId }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      identify { microsoftUserId }
    }
  }
`;
