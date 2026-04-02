import { gql } from '@apollo/client'

export const GET_ADMIN_COMPETITIONS = gql`
  query GetAdminCompetitions {
    competitions {
      id
      name
      type
      scene { id name }
    }
  }
`

export const GET_ADMIN_COMPETITION = gql`
  query GetAdminCompetition($id: ID!) {
    competition(id: $id) {
      id
      name
      type
      scene { id name }
      teams { id name group { id name } }
      league { id name }
    }
  }
`

export const GET_ADMIN_LEAGUES = gql`
  query GetAdminLeagues {
    leagues {
      id
      name
      teams { id name }
    }
  }
`

export const GET_ADMIN_LEAGUE = gql`
  query GetAdminLeague($id: ID!) {
    league(id: $id) {
      id
      name
      teams { id name group { id name } }
    }
  }
`

export const GET_ADMIN_LEAGUE_STANDINGS = gql`
  query GetAdminLeagueStandings($leagueId: ID!) {
    leagueStandings(leagueId: $leagueId) {
      id
      team { id name }
      points
      rank
      win
      draw
      lose
      goalsFor
      goalsAgainst
      goalDiff
    }
  }
`

export const GET_ADMIN_TOURNAMENTS = gql`
  query GetAdminTournaments($competitionId: ID!) {
    tournaments(competitionId: $competitionId) {
      id
      name
      bracketType
      placementMethod
      state
      progress
    }
  }
`

export const GET_ADMIN_TOURNAMENT = gql`
  query GetAdminTournament($id: ID!) {
    tournament(id: $id) {
      id
      competition { id name }
      name
      bracketType
      placementMethod
      displayOrder
      state
      progress
      matches {
        id
        time
        status
        entries { id team { id name } score }
      }
      slots {
        id
        sourceType
        seedNumber
        sourceMatch { id }
        matchEntry { id team { id name } score }
      }
    }
  }
`

export const GET_ADMIN_SCENES = gql`
  query GetAdminScenes {
    scenes {
      id
      name
    }
  }
`

export const CREATE_ADMIN_COMPETITION = gql`
  mutation CreateAdminCompetition($input: CreateCompetitionInput!) {
    createCompetition(input: $input) {
      id
      name
      type
      scene { id name }
    }
  }
`

export const UPDATE_ADMIN_COMPETITION = gql`
  mutation UpdateAdminCompetition($id: ID!, $input: UpdateCompetitionInput!) {
    updateCompetition(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_COMPETITION = gql`
  mutation DeleteAdminCompetition($id: ID!) {
    deleteCompetition(id: $id) {
      id
    }
  }
`

export const CREATE_ADMIN_LEAGUE = gql`
  mutation CreateAdminLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      id
      name
    }
  }
`

export const DELETE_ADMIN_LEAGUE = gql`
  mutation DeleteAdminLeague($id: ID!) {
    deleteLeague(id: $id) {
      id
    }
  }
`

export const UPDATE_ADMIN_LEAGUE_RULE = gql`
  mutation UpdateAdminLeagueRule($id: ID!, $input: UpdateLeagueRuleInput!) {
    updateLeagueRule(id: $id, input: $input) {
      id
      name
    }
  }
`

export const GENERATE_ADMIN_ROUND_ROBIN = gql`
  mutation GenerateAdminRoundRobin($id: ID!, $input: GenerateRoundRobinInput!) {
    generateRoundRobin(id: $id, input: $input) {
      id
    }
  }
`

export const CREATE_ADMIN_TOURNAMENT = gql`
  mutation CreateAdminTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      id
      name
      bracketType
    }
  }
`
