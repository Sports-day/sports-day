import { gql } from '@apollo/client'

export const GET_ADMIN_IMAGES = gql`
  query GetAdminImages {
    images {
      id
      url
      status
    }
  }
`

export const GET_ADMIN_IMAGE = gql`
  query GetAdminImage($id: ID!) {
    image(id: $id) {
      id
      url
      status
    }
  }
`

export const CREATE_ADMIN_IMAGE_UPLOAD_URL = gql`
  mutation CreateAdminImageUploadUrl($input: CreateImageUploadURLInput!) {
    createImageUploadURL(input: $input) {
      uploadUrl
      imageId
    }
  }
`

export const DELETE_ADMIN_IMAGE = gql`
  mutation DeleteAdminImage($id: ID!) {
    deleteImage(id: $id) {
      id
    }
  }
`
