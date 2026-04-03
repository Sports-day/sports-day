import { useFetchLocations } from "@/src/features/locations/hook";
import { useFetchTeams } from "@/src/features/teams/hook";
import { useFetchSport } from "@/src/features/sports/hook";
import { useFetchGames } from "@/src/features/games/hook";
import { useFetchMatches } from "@/src/features/matches/hook";
import { useFetchAllInformation } from "@/src/features/information/hook";
import {
  GetPanelSportQuery,
  GetPanelCompetitionsQuery,
  GetPanelTeamsQuery,
  GetPanelMatchesQuery,
  GetPanelLocationsQuery,
  GetPanelInformationsQuery,
} from "@/src/gql/__generated__/graphql";

// GraphQL 生成型エイリアス
type GqlSport = GetPanelSportQuery["sport"];
type GqlCompetition = GetPanelCompetitionsQuery["competitions"][0];
type GqlTeam = GetPanelTeamsQuery["teams"][0];
type GqlMatch = GetPanelMatchesQuery["matches"][0];
type GqlLocation = GetPanelLocationsQuery["locations"][0];
type GqlInformation = GetPanelInformationsQuery["Informations"][0];

export type SportDataType = {
  refresh: VoidFunction;
  isFetching: boolean;
  sport: GqlSport | undefined;
  image: GqlSport["image"] | undefined;
  games: GqlCompetition[]; // game = competition の同義語
  teams: GqlTeam[];
  matches: GqlMatch[];
  locations: GqlLocation[];
  informationList: GqlInformation[];
};

export const useFetchSportData = (sportId: string) => {
  const { sport, isFetching: isFetchingSport, refresh: refreshSport } = useFetchSport(sportId);
  const { locations, isFetching: isFetchingLocations, refresh: refreshLocations } = useFetchLocations();
  const { teams, isFetching: isFetchingTeams, refresh: refreshTeams } = useFetchTeams();
  const { games, isFetching: isFetchingGames, refresh: refreshGames } = useFetchGames();
  const { matches, isFetching: isFetchingMatches, refresh: refreshMatches } = useFetchMatches();
  const { allInformation, isFetching: isFetchingInformation } = useFetchAllInformation();

  // sport.scene[].scene.id → 対応する Scene ID 一覧
  const sportSceneIds = sport?.scene?.map((ss) => ss.scene.id) ?? [];

  // competitions（旧 games）を sport の scene で絞り込む
  const filteredGames = (games as GqlCompetition[]).filter((c) =>
    sportSceneIds.includes(c.scene.id)
  );

  // 絞り込まれた competition の ID 一覧
  const filteredCompetitionIds = filteredGames.map((c) => c.id);

  // matches を competition で絞り込む
  const filteredMatches = matches.filter((m) =>
    filteredCompetitionIds.includes(m.competition.id)
  );

  // teams を match の entries で絞り込む
  const filteredTeams = teams.filter((t) =>
    filteredMatches.some((m) =>
      m.entries.some((e) => e.team?.id === t.id)
    )
  );

  return {
    refresh: () => {
      refreshSport();
      refreshLocations();
      refreshTeams();
      refreshGames();
      refreshMatches();
    },
    isFetching:
      isFetchingSport ||
      isFetchingLocations ||
      isFetchingTeams ||
      isFetchingGames ||
      isFetchingMatches ||
      isFetchingInformation,
    locations: locations,
    // sport.image を直接使用（旧実装の iconId による images 一覧引き当てを廃止）
    image: sport?.image,
    sport: sport,
    games: filteredGames,
    teams: filteredTeams,
    matches: filteredMatches,
    informationList: allInformation,
  } as SportDataType;
};
