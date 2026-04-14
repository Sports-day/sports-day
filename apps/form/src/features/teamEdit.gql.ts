import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
      groups {
        id
        name
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      identify { microsoftUserId }
      groups { id }
    }
  }
`;

export const GET_SPORTSCENE = gql`
  query GetSportscene {
    scenes {
      isDeleted
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
            name
            users {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_SPORTSCENE_ENTRIES = gql`
  query GetSportsceneEntries {
    scenes {
      isDeleted
      sportScenes {
        id
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
  }
`;

export const GET_TEAM = gql`
  query GetTeam($teamId: ID!) {
    team(id: $teamId) {
      users {
        id
        name
        identify { microsoftUserId }
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
    updateTeamUsers(id: $teamId, input: { addUserIds: $userIds }) {
      id
    }
  }
`;

export const CREATE_SPORT_ENTRY = gql`
  mutation CreateSportEntry($sportSceneId: ID!, $teamId: ID!) {
    addSportEntries(id: $sportSceneId, input: { teamIds: [$teamId] }) {
      id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($teamId: ID!, $userIds: [ID!]!) {
    updateTeamUsers(id: $teamId, input: { removeUserIds: $userIds }) {
      id
    }
  }
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId) {
      id
    }
  }
`;

export const GET_SPORT_EXPERIENCE = gql`
  query GetSportExperience($sportId: ID!) {
    sport(id: $sportId) {
      experiencedLimit
    }
    sportExperiences(sportId: $sportId) {
      userId
    }
  }
`;

export const ADD_SPORT_EXPERIENCES = gql`
  mutation AddSportExperiences($sportId: ID!, $userIds: [ID!]!) {
    addSportExperiences(sportId: $sportId, userIds: $userIds) {
      userId
      sportId
    }
  }
`;

export const DELETE_SPORT_EXPERIENCES = gql`
  mutation DeleteSportExperiences($sportId: ID!, $userIds: [ID!]!) {
    deleteSportExperiences(sportId: $sportId, userIds: $userIds)
  }
`;
