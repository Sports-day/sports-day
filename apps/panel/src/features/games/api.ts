import { gql } from "@apollo/client";

// games = competitions（同義語）
export const GET_COMPETITIONS = gql`
  query GetPanelCompetitions {
    competitions {
      id
      name
      type
      scene {
        id
        name
      }
      teams {
        id
      }
      league {
        id
      }
    }
  }
`;

export const GET_PANEL_LEAGUE_STANDINGS = gql`
  query GetPanelLeagueStandings($leagueId: ID!) {
    leagueStandings(leagueId: $leagueId) {
      id
      team { id }
      rank
      points
      win
      draw
      lose
      goalsFor
      goalsAgainst
      goalDiff
    }
  }
`;

export const GET_PANEL_TOURNAMENT_RANKING = gql`
  query GetPanelTournamentRanking($competitionId: ID!) {
    tournamentRanking(competitionId: $competitionId) {
      rank
      team { id }
      isTied
    }
  }
`;