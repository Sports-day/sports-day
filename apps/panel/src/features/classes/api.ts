import { gql } from "@apollo/client";

// classes = groups（同義語）
export const GET_GROUPS = gql`
  query GetPanelGroups {
    groups {
      id
      name
    }
  }
`;

export const GET_GROUP = gql`
  query GetPanelGroup($id: ID!) {
    group(id: $id) {
      id
      name
      users {
        id
        name
        email
        identify { microsoftUserId }
      }
      teams {
        id
        name
      }
    }
  }
`;
