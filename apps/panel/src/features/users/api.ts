import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetPanelUsers {
    users {
      id
      name
      email
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
      name
      email
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
