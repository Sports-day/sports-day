import { gql } from '@apollo/client'

export const GET_ADMIN_SPORTS = gql`
  query GetAdminSports {
    sports {
      id
      name
      displayOrder
      image { id url }
      scene {
        id
        scene { id name }
      }
    }
  }
`

export const GET_ADMIN_SPORT = gql`
  query GetAdminSport($id: ID!) {
    sport(id: $id) {
      id
      name
      displayOrder
      experiencedLimit
      image { id url }
      rankingRules {
        conditionKey
        priority
      }
      rules { id rule }
      scene {
        id
        scene { id name }
      }
    }
  }
`

export const CREATE_ADMIN_SPORT = gql`
  mutation CreateAdminSport($input: CreateSportsInput!) {
    createSports(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_ADMIN_SPORT = gql`
  mutation UpdateAdminSport($id: ID!, $input: UpdateSportsInput!) {
    updateSports(id: $id, input: $input) {
      id
      name
      displayOrder
      experiencedLimit
    }
  }
`

export const DELETE_ADMIN_SPORT = gql`
  mutation DeleteAdminSport($id: ID!) {
    deleteSports(id: $id) {
      id
    }
  }
`

export const SET_ADMIN_RANKING_RULES = gql`
  mutation SetAdminRankingRules($sportId: ID!, $rules: [RankingRuleInput!]!) {
    setRankingRules(sportId: $sportId, rules: $rules) {
      id
      rankingRules {
        conditionKey
        priority
      }
    }
  }
`

export const CREATE_ADMIN_RULE = gql`
  mutation CreateAdminRule($input: CreateRuleInput!) {
    createRule(input: $input) {
      id
      rule
    }
  }
`

export const UPDATE_ADMIN_RULE = gql`
  mutation UpdateAdminRule($id: ID!, $input: UpdateRuleInput!) {
    updateRule(id: $id, input: $input) {
      id
      rule
    }
  }
`

export const DELETE_ADMIN_RULE = gql`
  mutation DeleteAdminRule($id: ID!) {
    deleteRule(id: $id) {
      id
    }
  }
`

export const GET_ADMIN_SCENES = gql`
  query GetAdminScenesForSports {
    scenes {
      id
      name
      isDeleted
    }
  }
`

export const ADD_ADMIN_SPORT_SCENES = gql`
  mutation AddAdminSportScenes($id: ID!, $input: AddSportScenesInput!) {
    addSportScenes(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_SPORT_SCENE = gql`
  mutation DeleteAdminSportScene($id: ID!) {
    deleteSportScene(id: $id) {
      id
    }
  }
`

export const UPDATE_ADMIN_SPORTS_DISPLAY_ORDER = gql`
  mutation UpdateAdminSportsDisplayOrder($input: [DisplayOrderItem!]!) {
    updateSportsDisplayOrder(input: $input)
  }
`
