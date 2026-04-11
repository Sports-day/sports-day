import { gql } from '@apollo/client'

export const GET_ADMIN_COMPETITIONS = gql`
  query GetAdminCompetitions {
    competitions {
      id
      name
      displayOrder
      type
      sport { id name }
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
      sport { id name }
      scene { id name }
      teams { id name group { id name } }
      startTime
      matchDuration
      breakDuration
      defaultLocation { id name }
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
      winPt
      drawPt
      losePt
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
      matchesPlayed
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
      competition { id name teams { id name } }
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
        winnerTeam { id }
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

export const UPDATE_ADMIN_TOURNAMENT = gql`
  mutation UpdateAdminTournament($id: ID!, $input: UpdateTournamentInput!) {
    updateTournament(id: $id, input: $input) {
      id
      name
      displayOrder
    }
  }
`

export const DELETE_ADMIN_TOURNAMENT = gql`
  mutation DeleteAdminTournament($id: ID!) {
    deleteTournament(id: $id) {
      id
    }
  }
`

export const GET_ADMIN_PROMOTION_RULES = gql`
  query GetAdminPromotionRules($sourceCompetitionId: ID!) {
    promotionRules(sourceCompetitionId: $sourceCompetitionId) {
      id
      sourceCompetition { id }
      targetCompetition { id name type }
      rankSpec
      slot
    }
  }
`

export const CREATE_ADMIN_PROMOTION_RULE = gql`
  mutation CreateAdminPromotionRule($input: CreatePromotionRuleInput!) {
    createPromotionRule(input: $input) {
      id
      rankSpec
      targetCompetition { id name type }
    }
  }
`

export const DELETE_ADMIN_PROMOTION_RULE = gql`
  mutation DeleteAdminPromotionRule($id: ID!) {
    deletePromotionRule(id: $id) {
      id
    }
  }
`

export const GET_ADMIN_SPORTS_WITH_SCENES = gql`
  query GetAdminSportsWithScenes {
    sports {
      id
      name
      scene {
        id
        scene { id name }
      }
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

export const GENERATE_ADMIN_SUB_BRACKET = gql`
  mutation GenerateAdminSubBracket($input: GenerateSubBracketInput!) {
    generateSubBracket(input: $input) {
      id
      name
      bracketType
      state
      progress
    }
  }
`

export const ASSIGN_SEED_TEAM = gql`
  mutation AssignAdminSeedTeam($input: AssignSeedTeamInput!) {
    assignSeedTeam(input: $input) {
      id
      seedNumber
      matchEntry { id team { id name } score }
    }
  }
`

export const UPDATE_SEED_NUMBERS = gql`
  mutation UpdateAdminSeedNumbers($tournamentId: ID!, $seeds: [SeedNumberInput!]!) {
    updateSeedNumbers(tournamentId: $tournamentId, seeds: $seeds) {
      id
      seedNumber
    }
  }
`

export const ADD_ADMIN_COMPETITION_ENTRIES = gql`
  mutation AddAdminCompetitionEntries($id: ID!, $input: UpdateCompetitionEntriesInput!) {
    addCompetitionEntries(id: $id, input: $input) {
      id
      teams { id name group { id name } }
    }
  }
`

export const DELETE_ADMIN_COMPETITION_ENTRIES = gql`
  mutation DeleteAdminCompetitionEntries($id: ID!, $input: UpdateCompetitionEntriesInput!) {
    deleteCompetitionEntries(id: $id, input: $input) {
      id
      teams { id name group { id name } }
    }
  }
`

export const UPDATE_ADMIN_PROMOTION_RULE = gql`
  mutation UpdateAdminPromotionRule($id: ID!, $input: UpdatePromotionRuleInput!) {
    updatePromotionRule(id: $id, input: $input) {
      id
      rankSpec
      slot
    }
  }
`

export const GENERATE_ADMIN_BRACKET = gql`
  mutation GenerateAdminBracket($input: GenerateBracketInput!) {
    generateBracket(input: $input) {
      id
      name
      bracketType
      state
    }
  }
`

export const RESET_ADMIN_TOURNAMENT_BRACKETS = gql`
  mutation ResetAdminTournamentBrackets($competitionId: ID!) {
    resetTournamentBrackets(competitionId: $competitionId) {
      id
    }
  }
`

export const REGENERATE_ADMIN_ROUND_ROBIN = gql`
  mutation RegenerateAdminRoundRobin($id: ID!) {
    regenerateRoundRobin(id: $id) {
      id
      time
      status
    }
  }
`

export const APPLY_ADMIN_COMPETITION_DEFAULTS = gql`
  mutation ApplyAdminCompetitionDefaults($id: ID!, $input: ApplyCompetitionDefaultsInput!) {
    applyCompetitionDefaults(id: $id, input: $input) {
      id
      time
      timeManual
      location { id name }
      locationManual
    }
  }
`

export const GET_ADMIN_TOURNAMENT_RANKING = gql`
  query GetAdminTournamentRanking($competitionId: ID!) {
    tournamentRanking(competitionId: $competitionId) {
      rank
      team { id name }
      isTied
    }
  }
`

export const UPDATE_ADMIN_COMPETITIONS_DISPLAY_ORDER = gql`
  mutation UpdateAdminCompetitionsDisplayOrder($input: [DisplayOrderItem!]!) {
    updateCompetitionsDisplayOrder(input: $input)
  }
`
