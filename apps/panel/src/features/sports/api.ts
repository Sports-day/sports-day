import { gql } from "@apollo/client";

export const GET_SPORTS = gql`
  query GetPanelSports {
    sports {
      id
      name
      weight
      image {
        id
        url
      }
      scene {
        id
        scene {
          id
          name
        }
      }
    }
  }
`;

export const GET_SPORT = gql`
  query GetPanelSport($id: ID!) {
    sport(id: $id) {
      id
      name
      weight
      rules {
        id
        rule
      }
      image {
        id
        url
      }
      scene {
        id
        sport {
          id
        }
        scene {
          id
          name
        }
        entries {
          id
          team {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_SPORT_COMPETITIONS = gql`
  query GetPanelSportCompetitions($id: ID!) {
    sport(id: $id) {
      id
      scene {
        id
        scene {
          id
          name
          sportScenes {
            id
          }
        }
        entries {
          id
          team {
            id
            name
          }
        }
      }
    }
  }
`;
