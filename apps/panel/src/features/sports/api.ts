import { gql } from "@apollo/client";

export const GET_SPORTS = gql`
  query GetPanelSports {
    sports {
      id
      name
      displayOrder
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
      displayOrder
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
