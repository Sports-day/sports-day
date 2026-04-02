import { gql } from '@apollo/client'

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    users {
      id
      name
      email
      groups { id name }
      teams { id name }
    }
  }
`

export const GET_ADMIN_USER = gql`
  query GetAdminUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      groups { id name }
      teams { id name }
    }
  }
`

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`
