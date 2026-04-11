import { gql } from '@apollo/client'

export const GET_ADMIN_LOCATIONS = gql`
  query GetAdminLocations {
    locations {
      id
      name
      displayOrder
    }
  }
`

export const GET_ADMIN_LOCATION = gql`
  query GetAdminLocation($id: ID!) {
    location(id: $id) {
      id
      name
    }
  }
`

export const CREATE_ADMIN_LOCATION = gql`
  mutation CreateAdminLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_ADMIN_LOCATION = gql`
  mutation UpdateAdminLocation($id: ID!, $input: UpdateLocationInput!) {
    updateLocation(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_LOCATION = gql`
  mutation DeleteAdminLocation($id: ID!) {
    deleteLocation(id: $id) {
      id
    }
  }
`

export const UPDATE_ADMIN_LOCATIONS_DISPLAY_ORDER = gql`
  mutation UpdateAdminLocationsDisplayOrder($input: [DisplayOrderItem!]!) {
    updateLocationsDisplayOrder(input: $input)
  }
`
