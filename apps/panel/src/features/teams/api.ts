import { gql } from "@apollo/client";

export const GET_TEAMS = gql`
  query GetPanelTeams {
    teams {
      id
      name
      group {
        id
        name
      }
      users {
        id
        name
      }
    }
  }
`;

export const GET_TEAM = gql`
  query GetPanelTeam($id: ID!) {
    team(id: $id) {
      id
      name
      group {
        id
        name
      }
      users {
        id
        name
        email
      }
    }
  }
`;
