import { gql } from '@apollo/client'

// tags feature は GraphQL の scenes にマッピングされる
// Tag.id/name/isDeleted → Scene.id/name/isDeleted

export const GET_ADMIN_SCENES_FOR_TAGS = gql`
  query GetAdminScenesForTags {
    scenes {
      id
      name
      displayOrder
      isDeleted
    }
  }
`

export const GET_ADMIN_SCENE_FOR_TAG = gql`
  query GetAdminSceneForTag($id: ID!) {
    scene(id: $id) {
      id
      name
      isDeleted
    }
  }
`

export const CREATE_ADMIN_SCENE_FOR_TAG = gql`
  mutation CreateAdminSceneForTag($input: CreateSceneInput!) {
    createScene(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_ADMIN_SCENE_FOR_TAG = gql`
  mutation UpdateAdminSceneForTag($id: ID!, $input: UpdateSceneInput!) {
    updateScene(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_SCENE_FOR_TAG = gql`
  mutation DeleteAdminSceneForTag($id: ID!) {
    deleteScene(id: $id) {
      id
    }
  }
`

export const RESTORE_ADMIN_SCENE_FOR_TAG = gql`
  mutation RestoreAdminSceneForTag($id: ID!) {
    restoreScene(id: $id) {
      id
      name
      isDeleted
    }
  }
`

export const UPDATE_ADMIN_SCENES_DISPLAY_ORDER = gql`
  mutation UpdateAdminScenesDisplayOrder($input: [DisplayOrderItem!]!) {
    updateScenesDisplayOrder(input: $input)
  }
`
