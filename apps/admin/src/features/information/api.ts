import { gql } from '@apollo/client'

export const GET_ADMIN_INFORMATIONS = gql`
  query GetAdminInformations {
    Informations {
      id
      title
      content
      status
    }
  }
`

export const GET_ADMIN_INFORMATION = gql`
  query GetAdminInformation($id: ID!) {
    Information(id: $id) {
      id
      title
      content
      status
    }
  }
`

export const CREATE_ADMIN_INFORMATION = gql`
  mutation CreateAdminInformation($input: CreateInformationInput!) {
    createInformation(input: $input) {
      id
      title
      content
      status
    }
  }
`

export const UPDATE_ADMIN_INFORMATION = gql`
  mutation UpdateAdminInformation($id: ID!, $input: UpdateInformationInput!) {
    updateInformation(id: $id, input: $input) {
      id
      title
      content
      status
    }
  }
`

export const DELETE_ADMIN_INFORMATION = gql`
  mutation DeleteAdminInformation($id: ID!) {
    deleteInformation(id: $id) {
      id
    }
  }
`
