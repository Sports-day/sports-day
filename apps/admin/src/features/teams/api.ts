import { gql } from '@apollo/client'

export const GET_ADMIN_TEAMS = gql`
  query GetAdminTeams {
    teams {
      id
      name
      group { id name }
      users { id name email }
    }
  }
`

export const GET_ADMIN_TEAM = gql`
  query GetAdminTeam($id: ID!) {
    team(id: $id) {
      id
      name
      group { id name }
      users { id name email }
    }
  }
`

export const CREATE_ADMIN_TEAM = gql`
  mutation CreateAdminTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      group { id name }
    }
  }
`

export const UPDATE_ADMIN_TEAM = gql`
  mutation UpdateAdminTeam($id: ID!, $input: UpdateTeamInput!) {
    updateTeam(id: $id, input: $input) {
      id
      name
      group { id name }
    }
  }
`

export const DELETE_ADMIN_TEAM = gql`
  mutation DeleteAdminTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`

export const UPDATE_ADMIN_TEAM_USERS = gql`
  mutation UpdateAdminTeamUsers($id: ID!, $input: UpdateTeamUsersInput!) {
    updateTeamUsers(id: $id, input: $input) {
      id
      users { id name email }
    }
  }
`

export const GET_ADMIN_ALL_USERS_FOR_TEAMS = gql`
  query GetAdminAllUsersForTeams {
    users {
      id
      name
      email
      gender
      groups { id name }
    }
  }
`

export const GET_ADMIN_GROUPS = gql`
  query GetAdminGroups {
    groups {
      id
      name
    }
  }
`
