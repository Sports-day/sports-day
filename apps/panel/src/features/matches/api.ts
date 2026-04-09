import { gql } from "@apollo/client";

export const GET_MATCHES = gql`
  query GetPanelMatches {
    matches {
      id
      time
      status
      location {
        id
        name
      }
      competition {
        id
        name
        sport {
          id
        }
        scene {
          id
        }
      }
      winnerTeam {
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
      judgment {
        team {
          id
          name
        }
      }
    }
  }
`;

export const GET_MATCH = gql`
  query GetPanelMatch($id: ID!) {
    match(id: $id) {
      id
      time
      status
      location {
        id
        name
      }
      competition {
        id
        name
        scene {
          id
        }
      }
      winnerTeam {
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
      judgment {
        id
        name
        user {
          id
          name
        }
        team {
          id
          name
        }
      }
    }
  }
`;
