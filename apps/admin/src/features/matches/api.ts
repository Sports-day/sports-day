import { gql } from '@apollo/client'

export const GET_ADMIN_LOCATIONS_FOR_MATCHES = gql`
  query GetAdminLocationsForMatches {
    locations {
      id
      name
    }
  }
`

export const GET_ADMIN_MATCHES = gql`
  query GetAdminMatches {
    matches {
      id
      time
      status
      location { id name }
      competition { id name }
      winnerTeam { id }
      entries { id team { id name } score }
    }
  }
`

export const GET_ADMIN_MATCH = gql`
  query GetAdminMatch($id: ID!) {
    match(id: $id) {
      id
      time
      status
      location { id name }
      competition { id name }
      entries { id team { id name } score }
    }
  }
`

export const UPDATE_ADMIN_MATCH_RESULT = gql`
  mutation UpdateAdminMatchResult($id: ID!, $input: UpdateMatchResultInput!) {
    updateMatchResult(id: $id, input: $input) {
      id
      status
      entries { id team { id name } score }
    }
  }
`

export const UPDATE_ADMIN_MATCH_DETAIL = gql`
  mutation UpdateAdminMatchDetail($id: ID!, $input: UpdateMatchDetailInput!) {
    updateMatchDetail(id: $id, input: $input) {
      id
      time
      location { id name }
    }
  }
`
