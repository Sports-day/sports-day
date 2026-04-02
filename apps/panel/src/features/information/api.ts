import { gql } from "@apollo/client";

export const GET_INFORMATIONS = gql`
  query GetPanelInformations {
    Informations {
      id
      title
      content
    }
  }
`;

export const GET_INFORMATION = gql`
  query GetPanelInformation($id: ID!) {
    Information(id: $id) {
      id
      title
      content
    }
  }
`;
