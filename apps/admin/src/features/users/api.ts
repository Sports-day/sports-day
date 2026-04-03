import { gql } from '@apollo/client'

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    users {
      id
      name
      email
      gender
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
      gender
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
      gender
    }
  }
`

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      gender
    }
  }
`

export const DELETE_ADMIN_USER = gql`
  mutation DeleteAdminUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`
