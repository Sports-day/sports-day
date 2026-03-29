import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

export const GET_SPORTSCENE = gql`
  query GetSportscene {
    sportScenes {
      id
      sport {
        id
      }
      scene {
        id
      }
      entries {
        team {
          id
          users {
            id
          }
        }
      }
    }
  }
`;

export const GET_TEAM = gql`
  query SportScenes($teamId: ID!) {
    team(id: $teamId) {
      users {
        id
        name
      }
    }
  }
`;

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
    }
  }
`;

export const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember($userIds: [ID!]!, $teamId: ID!) {
    addTeamMember(userIds: $userIds, teamId: $teamId) {
      id
    }
  }
`;

export const CREATE_SPORT_ENTRY = gql`
  mutation CreateSportEntry($input: CreateSportEntryInput!) {
    createSportEntry(input: $input) {
      id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($teamId: ID!, $userIds: [ID!]!) {
    removeTeamMember(teamId: $teamId, userIds: $userIds) {
      id
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId)
  }
`;
