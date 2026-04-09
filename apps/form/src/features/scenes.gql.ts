import { gql } from "@apollo/client";

export const GET_TYPE = gql`
  query GetType {
    scenes {
      id
      isDeleted
    }
  }
`;

export const GET_WEATHER = gql`
  query GetWeather {
    scenes {
      id
      name
      isDeleted
    }
  }
`;

export const GET_SPORT = gql`
  query GetSport($sceneId: ID!) {
    scene(id: $sceneId) {
      name
      sportScenes {
        sport {
          id
          name
          image {
            url
          }
        }
      }
    }
  }
`;

export const GET_SPORT_DETAIL = gql`
  query GetSportDetail($sportId: ID!, $sceneId: ID!) {
    sport(id: $sportId) {
      name
    }
    scene(id: $sceneId) {
      name
    }
  }
`;

export const SPORT_DATA_GET = gql`
  query SportDataGet($sport_Id: ID!, $scene_Id: ID!) {
    sport(id: $sport_Id) {
      name
    }
    scene(id: $scene_Id) {
      name
    }
  }
`;

export const GET_TEAM_DATA = gql`
  query GetTeamData {
    scenes {
      isDeleted
      sportScenes {
        sport {
          id
        }
        scene {
          id
        }
        entries {
          team {
            users {
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_SCENE_SPORT = gql`
  query GetSceneSport {
    scenes {
      isDeleted
      sportScenes {
        id
        entries {
          team {
            id
            name
            users {
              id
              name
            }
          }
        }
        sport {
          id
        }
        scene {
          id
        }
      }
    }
  }
`;

export const GET_ALLTEAMDATA = gql`
  query GetAllTeamdata {
    scenes {
      isDeleted
      sportScenes {
        scene {
          id
          name
        }
        sport {
          id
          name
        }
        entries {
          team {
            id
            name
            users {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_SPORT_EXPERIENCES = gql`
  query GetAllSportExperiences {
    allSportExperiences {
      userId
      sportId
    }
  }
`;

export const DELETE_TEAM_FROM_POPUP = gql`
  mutation DeleteTeamFromPopup($deleteTeamId: ID!) {
    deleteTeam(id: $deleteTeamId) {
      id
    }
  }
`;
