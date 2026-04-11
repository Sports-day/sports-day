import { gql } from "@apollo/client";

export const GET_MATCHES = gql`
  query GetPanelMatches {
    matches {
      id
      time
      status
      location {
        id
        name
      }
      competition {
        id
        name
        type
        sport {
          id
        }
        scene {
          id
        }
      }
      winnerTeam {
        id
        name
      }
      entries {
        id
        team {
          id
          name
        }
        score
      }
      judgment {
        id
        isAttending
        user {
          id
        }
        team {
          id
          name
        }
        group {
          id
        }
      }
    }
  }
`;

export const MARK_PANEL_JUDGMENT_ATTENDANCE = gql`
  mutation MarkPanelJudgmentAttendance($matchId: ID!) {
    markJudgmentAttendance(matchId: $matchId) {
      id
      isAttending
    }
  }
`;

export const SUBMIT_PANEL_MATCH_SCORE = gql`
  mutation SubmitPanelMatchScore($matchId: ID!, $input: SubmitScoreInput!) {
    submitMatchScore(matchId: $matchId, input: $input) {
      id
      status
      entries {
        id
        team {
          id
          name
        }
        score
      }
      winnerTeam {
        id
        name
      }
    }
  }
`;

export const GET_MATCH = gql`
  query GetPanelMatch($id: ID!) {
    match(id: $id) {
      id
      time
      status
      location {
        id
        name
      }
      competition {
        id
        name
        scene {
          id
        }
      }
      winnerTeam {
        id
        name
      }
      entries {
        id
        team {
          id
          name
        }
        score
      }
      judgment {
        id
        name
        isAttending
        user {
          id
          name
        }
        team {
          id
          name
        }
        group {
          id
        }
      }
    }
  }
`;
