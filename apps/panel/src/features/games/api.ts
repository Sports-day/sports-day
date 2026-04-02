import { gql } from "@apollo/client";

// games = competitions（同義語）
export const GET_COMPETITIONS = gql`
  query GetPanelCompetitions {
    competitions {
      id
      name
      type
      scene {
        id
        name
      }
    }
  }
`;

export const GET_COMPETITION = gql`
  query GetPanelCompetition($id: ID!) {
    competition(id: $id) {
      id
      name
      type
      scene {
        id
        name
      }
      teams {
        id
        name
      }
      matches {
        id
        time
        status
        location {
          id
          name
        }
        entries {
          id
          team {
            id
            name
          }
          score
        }
      }
    }
  }
`;
