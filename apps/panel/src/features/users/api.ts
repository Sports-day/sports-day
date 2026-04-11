import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetPanelUsers {
    users {
      id
      identify { microsoftUserId }
      teams {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetPanelUser($id: ID!) {
    user(id: $id) {
      id
      identify { microsoftUserId }
      groups {
        id
        name
      }
      teams {
        id
        name
      }
    }
  }
`;
