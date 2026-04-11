import { gql } from "@apollo/client";

// tags = scenes（同義語）
export const GET_SCENES = gql`
  query GetPanelScenes {
    scenes {
      id
      name
    }
  }
`;

export const GET_SCENE = gql`
  query GetPanelScene($id: ID!) {
    scene(id: $id) {
      id
      name
    }
  }
`;
