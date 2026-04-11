import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetPanelMe {
    me {
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
