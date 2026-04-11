import { gql } from '@apollo/client'

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    users {
      id
      name
      email
      role
      identify { microsoftUserId }
      groups { id name }
      teams { id name }
    }
    sports {
      id
      name
    }
    allSportExperiences {
      userId
      sportId
    }
  }
`

export const GET_ADMIN_USER = gql`
  query GetAdminUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      identify { microsoftUserId }
      groups { id name }
      teams { id name }
    }
  }
`

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: CreateUserInput!) {
    createUser(input: $input) { id }
  }
`

export const BATCH_CREATE_ADMIN_USERS = gql`
  mutation BatchCreateAdminUsers($input: BatchCreateUsersInput!) {
    batchCreateUsers(input: $input) {
      users {
        id
      }
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

export const UPDATE_ADMIN_USER_ROLE = gql`
  mutation UpdateAdminUserRole($userId: ID!, $role: Role!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`

export const GET_ADMIN_USER_SPORT_EXPERIENCES = gql`
  query GetAdminUserSportExperiences($userId: ID!) {
    userSportExperiences(userId: $userId) {
      userId
      sportId
    }
    sports {
      id
      name
    }
  }
`

export const ADD_ADMIN_SPORT_EXPERIENCES = gql`
  mutation AddAdminSportExperiences($sportId: ID!, $userIds: [ID!]!) {
    addSportExperiences(sportId: $sportId, userIds: $userIds) {
      userId
      sportId
    }
  }
`

export const DELETE_ADMIN_SPORT_EXPERIENCES = gql`
  mutation DeleteAdminSportExperiences($sportId: ID!, $userIds: [ID!]!) {
    deleteSportExperiences(sportId: $sportId, userIds: $userIds)
  }
`
