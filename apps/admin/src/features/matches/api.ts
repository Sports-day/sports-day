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
      timeManual
      status
      location { id name }
      locationManual
      competition {
        id name type sport { id name }
        tournaments { id name bracketType matches { id } }
      }
      winnerTeam { id }
      entries { id team { id name } score }
      judgment { id name }
    }
  }
`

export const GET_ADMIN_COMPETITION_MATCHES = gql`
  query GetAdminCompetitionMatches($competitionId: ID!) {
    competition(id: $competitionId) {
      id
      matches {
        id
        time
        timeManual
        status
        location { id name }
        winnerTeam { id }
        entries { id team { id name } score }
      }
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
      judgment { id name user { id name } team { id name } group { id name } }
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

export const CREATE_ADMIN_MATCH = gql`
  mutation CreateAdminMatch($input: CreateMatchInput!) {
    createMatch(input: $input) {
      id
      time
      status
      location { id name }
      competition { id name }
      entries { id team { id name } score }
    }
  }
`

export const DELETE_ADMIN_MATCH = gql`
  mutation DeleteAdminMatch($id: ID!) {
    deleteMatch(id: $id) {
      id
    }
  }
`

export const ADD_ADMIN_MATCH_ENTRIES = gql`
  mutation AddAdminMatchEntries($id: ID!, $input: UpdateMatchEntriesInput!) {
    addMatchEntries(id: $id, input: $input) {
      id
      entries { id team { id name } score }
    }
  }
`

export const DELETE_ADMIN_MATCH_ENTRIES = gql`
  mutation DeleteAdminMatchEntries($id: ID!, $input: UpdateMatchEntriesInput!) {
    deleteMatchEntries(id: $id, input: $input) {
      id
      entries { id team { id name } score }
    }
  }
`

export const UPDATE_ADMIN_JUDGMENT = gql`
  mutation UpdateAdminJudgment($id: ID!, $input: UpdateJudgmentInput!) {
    updateJudgment(id: $id, input: $input) {
      id
      name
      user { id name }
      team { id name }
      group { id name }
    }
  }
`

export const CREATE_ADMIN_TOURNAMENT_MATCH = gql`
  mutation CreateAdminTournamentMatch($input: CreateTournamentMatchInput!) {
    createTournamentMatch(input: $input) {
      id
      time
      status
      entries { id team { id name } score }
    }
  }
`

export const DELETE_ADMIN_TOURNAMENT_MATCH = gql`
  mutation DeleteAdminTournamentMatch($matchId: ID!) {
    deleteTournamentMatch(matchId: $matchId) {
      id
    }
  }
`

export const UPDATE_ADMIN_SLOT_CONNECTION = gql`
  mutation UpdateAdminSlotConnection($input: UpdateSlotConnectionInput!) {
    updateSlotConnection(input: $input) {
      id
      sourceType
      sourceMatch { id }
      seedNumber
    }
  }
`

export const GET_ADMIN_COMPETITION_JUDGE_OPTIONS = gql`
  query GetAdminCompetitionJudgeOptions($competitionId: ID!) {
    competition(id: $competitionId) {
      id
      teams {
        id
        name
        group { id name }
        users { id name }
      }
    }
  }
`

export const SET_ADMIN_TIEBREAK_PRIORITIES = gql`
  mutation SetAdminTiebreakPriorities($leagueId: ID!, $priorities: [TiebreakPriorityInput!]!) {
    setTiebreakPriorities(leagueId: $leagueId, priorities: $priorities) {
      team { id name }
      priority
    }
  }
`
