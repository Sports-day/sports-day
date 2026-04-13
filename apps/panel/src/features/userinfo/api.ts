import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetPanelMe {
    me {
      id
      name
      email
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
