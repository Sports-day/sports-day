import { gql } from "@apollo/client";

export const GET_IMAGES = gql`
  query GetPanelImages {
    images {
      id
      url
      status
    }
  }
`;

export const GET_IMAGE = gql`
  query GetPanelImage($id: ID!) {
    image(id: $id) {
      id
      url
      status
    }
  }
`;
