import { useState, useEffect, useMemo, useRef } from "react";
import { useFetchLocations } from "@/src/features/locations/hook";
import { useFetchTeams } from "@/src/features/teams/hook";
import { useFetchSports } from "@/src/features/sports/hook";
import { useFetchGames } from "@/src/features/games/hook";
import { useFetchMatches } from "@/src/features/matches/hook";
import { useFetchUsers, type ResolvedUser } from "@/src/features/users/hook";
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
type GqlUser = ResolvedUser;
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
  myTeamUsers: Array<{ id: string; name: string }>;
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

  const [myTeamRankState, setMyTeamRank] = useState<number>(0);

  // 全サブクエリの完了を検知
  const allLoaded =
    !isFetchingImages &&
    !isFetchingLocations &&
    !isFetchingTeams &&
    !isFetchingSports &&
    !isFetchingGames &&
    !isFetchingMatches &&
    !isFetchingUsers &&
    !isFetchingUserinfo;

  // データからダッシュボードの派生状態を計算（useMemoで無限ループ防止）
  const derived = useMemo(() => {
    if (!allLoaded || !user) return null;

    const myTeamIds = (user as GqlMeUser).teams.map((t) => t.id);
    if (myTeamIds.length === 0) return null;

    const myCompetitions = (games as GqlCompetition[]).filter((c) =>
      c.teams.some((t) => myTeamIds.includes(t.id))
    );
    if (myCompetitions.length === 0) return null;

    const competitionsByWeight = [...myCompetitions].sort((a, b) => {
      const sportA = sports.find((s) => s.id === a.sport?.id);
      const sportB = sports.find((s) => s.id === b.sport?.id);
      return (sportA?.displayOrder ?? 0) - (sportB?.displayOrder ?? 0);
    });
    const myCompetition = competitionsByWeight[0];

    const myTeam = teams.find(
      (t) =>
        myTeamIds.includes(t.id) &&
        myCompetition.teams.some((ct) => ct.id === t.id)
    );
    if (!myTeam) return { myGame: myCompetition };

    const mySport = sports.find((s) => s.id === myCompetition.sport?.id);

    const myTeamUsers = myTeam.users.map(u => {
      const resolved = users.find(ru => ru.id === u.id);
      return { id: u.id, name: resolved?.name ?? '' };
    });

    const myTeamMatches = matches
      .filter((m) => m.competition.id === myCompetition.id)
      .filter((m) => m.entries.some((e) => e.team?.id === myTeam.id));

    const myJudgeMatches = matches.filter((m) => m.judgment?.team?.id === myTeam.id);

    return { myGame: myCompetition, myTeam, mySport, myTeamUsers, myTeamMatches, myJudgeMatches };
  }, [allLoaded, user, games, sports, teams, matches, users]);

  const myGameState = derived?.myGame;
  const myTeamState = derived?.myTeam;
  const mySportState = derived?.mySport;
  const myTeamUsersState = derived?.myTeamUsers ?? [];
  const myTeamMatchesState = derived?.myTeamMatches ?? [];
  const myJudgeMatchesState = derived?.myJudgeMatches ?? [];

  // isFetching を allLoaded に連動
  const prevAllLoaded = useRef(false);
  useEffect(() => {
    if (allLoaded && !prevAllLoaded.current) {
      setIsFetching(false);
    }
    prevAllLoaded.current = allLoaded;
  }, [allLoaded]);

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
