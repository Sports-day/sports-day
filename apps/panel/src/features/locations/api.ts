import { gql } from "@apollo/client";

export const GET_LOCATIONS = gql`
  query GetPanelLocations {
    locations {
      id
      name
    }
  }
`;

export const GET_LOCATION = gql`
  query GetPanelLocation($id: ID!) {
    location(id: $id) {
      id
      name
    }
  }
`;
