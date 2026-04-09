import { gql } from '@apollo/client'

// classes feature は GraphQL の groups にマッピングされる
// Class.id/name → Group.id/name

export const GET_ADMIN_GROUPS_FOR_CLASSES = gql`
  query GetAdminGroupsForClasses {
    groups {
      id
      name
      users { id }
    }
  }
`

export const GET_ADMIN_GROUP_FOR_CLASS = gql`
  query GetAdminGroupForClass($id: ID!) {
    group(id: $id) {
      id
      name
      users { id name email gender }
    }
  }
`

export const CREATE_ADMIN_GROUP_FOR_CLASS = gql`
  mutation CreateAdminGroupForClass($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_ADMIN_GROUP_FOR_CLASS = gql`
  mutation UpdateAdminGroupForClass($id: ID!, $input: UpdateGroupInput!) {
    updateGroup(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_GROUP_FOR_CLASS = gql`
  mutation DeleteAdminGroupForClass($id: ID!) {
    deleteGroup(id: $id) {
      id
    }
  }
`

export const ADD_ADMIN_GROUP_USERS_FOR_CLASS = gql`
  mutation AddAdminGroupUsersForClass($id: ID!, $input: UpdateGroupUsersInput!) {
    addGroupUsers(id: $id, input: $input) {
      id
      users { id name email gender }
    }
  }
`

export const REMOVE_ADMIN_GROUP_USERS_FOR_CLASS = gql`
  mutation RemoveAdminGroupUsersForClass($id: ID!, $input: UpdateGroupUsersInput!) {
    removeGroupUsers(id: $id, input: $input) {
      id
      users { id name email gender }
    }
  }
`
