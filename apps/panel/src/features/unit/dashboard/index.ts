import { useState, useEffect } from "react";
import { useFetchLocations } from "@/src/features/locations/hook";
import { useFetchTeams } from "@/src/features/teams/hook";
import { useFetchSports } from "@/src/features/sports/hook";
import { useFetchGames } from "@/src/features/games/hook";
import { useFetchMatches } from "@/src/features/matches/hook";
import { useFetchUsers } from "@/src/features/users/hook";
import { useFetchImages } from "@/src/features/images/hook";
import { useFetchUserinfo } from "@/src/features/userinfo/hook";
import {
  GetPanelSportsQuery,
  GetPanelTeamsQuery,
  GetPanelMatchesQuery,
  GetPanelLocationsQuery,
  GetPanelImagesQuery,
  GetPanelUsersQuery,
  GetPanelCompetitionsQuery,
  GetPanelMeQuery,
  CompetitionType,
  useGetPanelLeagueStandingsQuery,
  useGetPanelTournamentRankingQuery,
} from "@/src/gql/__generated__/graphql";

// GraphQL 生成型エイリアス
type GqlSport = GetPanelSportsQuery["sports"][0];
type GqlTeam = GetPanelTeamsQuery["teams"][0];
type GqlMatch = GetPanelMatchesQuery["matches"][0];
type GqlLocation = GetPanelLocationsQuery["locations"][0];
type GqlImage = GetPanelImagesQuery["images"][0];
type GqlUser = GetPanelUsersQuery["users"][0];
type GqlCompetition = GetPanelCompetitionsQuery["competitions"][0];
type GqlMeUser = GetPanelMeQuery["me"];

export type DashboardDataType = {
  isFetching: boolean;
  images: GqlImage[];
  locations: GqlLocation[];
  teams: GqlTeam[];
  users: GqlUser[];
  sports: GqlSport[];
  games: GqlCompetition[]; // game = competition の同義語
  matches: GqlMatch[];
  mySport: GqlSport | undefined;
  myGame: GqlCompetition | undefined;
  myTeam: GqlTeam | undefined;
  myTeamUsers: GqlTeam["users"];
  myTeamMatches: GqlMatch[];
  myTeamRank: number;
  myJudgeMatches: GqlMatch[];
  refetchMatches: () => Promise<unknown>;
};

export const useFetchDashboard = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { images, isFetching: isFetchingImages } = useFetchImages();
  const { locations, isFetching: isFetchingLocations } = useFetchLocations();
  const { teams, isFetching: isFetchingTeams } = useFetchTeams();
  const { sports, isFetching: isFetchingSports } = useFetchSports(true);
  const { games, isFetching: isFetchingGames } = useFetchGames(true);
  const { matches, isFetching: isFetchingMatches, refresh: refetchMatches } = useFetchMatches();
  const { users, isFetching: isFetchingUsers } = useFetchUsers();
  const { user, isFetching: isFetchingUserinfo } = useFetchUserinfo();

  const [mySportState, setMySport] = useState<GqlSport | undefined>(undefined);
  const [myGameState, setMyGame] = useState<GqlCompetition | undefined>(undefined);
  const [myTeamState, setMyTeam] = useState<GqlTeam | undefined>(undefined);
  const [myTeamMatchesState, setMyTeamMatches] = useState<GqlMatch[]>([]);
  const [myTeamUsersState, setMyTeamUsers] = useState<GqlTeam["users"]>([]);
  const [myTeamRankState, setMyTeamRank] = useState<number>(0);
  const [myJudgeMatchesState, setMyJudgeMatches] = useState<GqlMatch[]>([]);

  // 全サブクエリの完了を検知してデータを処理
  const allLoaded =
    !isFetchingImages &&
    !isFetchingLocations &&
    !isFetchingTeams &&
    !isFetchingSports &&
    !isFetchingGames &&
    !isFetchingMatches &&
    !isFetchingUsers &&
    !isFetchingUserinfo;

  useEffect(() => {
    if (!allLoaded) return;

    if (user) {
      const myTeamIds = (user as GqlMeUser).teams.map((t) => t.id);

      if (myTeamIds.length > 0) {
        const myCompetitions = (games as GqlCompetition[]).filter((c) =>
          c.teams.some((t) => myTeamIds.includes(t.id))
        );

        if (myCompetitions.length > 0) {
          const competitionsByWeight = [...myCompetitions].sort((a, b) => {
            const sportA = sports.find((s) => s.id === a.sport?.id);
            const sportB = sports.find((s) => s.id === b.sport?.id);
            return (sportB?.weight ?? 0) - (sportA?.weight ?? 0);
          });
          const myCompetition = competitionsByWeight[0];
          setMyGame(myCompetition);

          const myTeam = teams.find(
            (t) =>
              myTeamIds.includes(t.id) &&
              myCompetition.teams.some((ct) => ct.id === t.id)
          );

          if (myTeam) {
            setMyTeam(myTeam);
            setMyTeamUsers(myTeam.users);

            const mySport = sports.find((s) => s.id === myCompetition.sport?.id);
            if (mySport) setMySport(mySport);

            const myCompetitionMatches = matches.filter(
              (m) => m.competition.id === myCompetition.id
            );
            setMyTeamMatches(
              myCompetitionMatches.filter((m) =>
                m.entries.some((e) => e.team?.id === myTeam.id)
              )
            );

            setMyJudgeMatches(
              matches.filter((m) => m.judgment?.team?.id === myTeam.id)
            );
          }
        }
      }
    }

    setIsFetching(false);
  }, [allLoaded, user, games, sports, teams, matches]);

  // myGame が確定したら standings / ranking を取得してランクを更新
  const myGameLeagueId = myGameState?.league?.id ?? '';
  const isLeagueGame = myGameState?.type === CompetitionType.League;

  const { data: standingsData } = useGetPanelLeagueStandingsQuery({
    variables: { leagueId: myGameLeagueId },
    skip: !myGameLeagueId || !isLeagueGame,
  });
  const { data: rankingData } = useGetPanelTournamentRankingQuery({
    variables: { competitionId: myGameState?.id ?? '' },
    skip: !myGameState?.id || isLeagueGame,
  });

  useEffect(() => {
    if (!myTeamState) return;
    const leagueRank = standingsData?.leagueStandings.find(s => s.team.id === myTeamState.id)?.rank;
    const tournamentRank = rankingData?.tournamentRanking.find(r => r.team.id === myTeamState.id)?.rank;
    const rank = leagueRank ?? tournamentRank;
    if (rank !== undefined) setMyTeamRank(rank);
  }, [standingsData, rankingData, myTeamState]);

  return {
    isFetching: isFetching,
    images: images,
    locations: locations,
    teams: teams,
    users: users,
    sports: sports,
    games: games as GqlCompetition[],
    matches: matches,
    mySport: mySportState,
    myGame: myGameState,
    myTeam: myTeamState,
    myTeamUsers: myTeamUsersState,
    myTeamMatches: myTeamMatchesState,
    myTeamRank: myTeamRankState,
    myJudgeMatches: myJudgeMatchesState,
    refetchMatches: refetchMatches,
  } as DashboardDataType;
};
