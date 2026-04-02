import { useState } from "react";
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
};

export const useFetchDashboard = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { images, isFetching: isFetchingImages } = useFetchImages();
  const { locations, isFetching: isFetchingLocations } = useFetchLocations();
  const { teams, isFetching: isFetchingTeams } = useFetchTeams();
  const { sports, isFetching: isFetchingSports } = useFetchSports(true);
  const { games, isFetching: isFetchingGames } = useFetchGames(true);
  const { matches, isFetching: isFetchingMatches } = useFetchMatches();
  const { users, isFetching: isFetchingUsers } = useFetchUsers();
  const { user, isFetching: isFetchingUserinfo } = useFetchUserinfo();

  const [mySportState, setMySport] = useState<GqlSport | undefined>(undefined);
  const [myGameState, setMyGame] = useState<GqlCompetition | undefined>(undefined);
  const [myTeamState, setMyTeam] = useState<GqlTeam | undefined>(undefined);
  const [myTeamMatchesState, setMyTeamMatches] = useState<GqlMatch[]>([]);
  const [myTeamUsersState, setMyTeamUsers] = useState<GqlTeam["users"]>([]);
  const [myTeamRankState, setMyTeamRank] = useState<number>(0);
  const [myJudgeMatchesState, setMyJudgeMatches] = useState<GqlMatch[]>([]);

  if (
    !isFetchingImages &&
    !isFetchingLocations &&
    !isFetchingTeams &&
    !isFetchingSports &&
    !isFetchingGames &&
    !isFetchingMatches &&
    !isFetchingUsers &&
    !isFetchingUserinfo &&
    isFetching
  ) {
    fetchBlock: {
      if (!user) break fetchBlock;

      // me.teams → 自分が所属するチーム ID 一覧
      const myTeamIds = (user as GqlMeUser).teams.map((t) => t.id);
      if (myTeamIds.length === 0) break fetchBlock;

      // competitions（旧 games）のうち、自分のチームが参加しているものを抽出
      const myCompetitions = (games as GqlCompetition[]).filter((c) =>
        c.teams.some((t) => myTeamIds.includes(t.id))
      );
      if (myCompetitions.length === 0) break fetchBlock;

      // competition の sport weight でソートして最重要 competition を決定
      const competitionsByWeight = [...myCompetitions].sort((a, b) => {
        const sportA = sports.find((s) =>
          s.scene?.some((ss) => ss.scene.id === a.scene.id)
        );
        const sportB = sports.find((s) =>
          s.scene?.some((ss) => ss.scene.id === b.scene.id)
        );
        return (sportB?.weight ?? 0) - (sportA?.weight ?? 0);
      });
      const myCompetition = competitionsByWeight[0];
      setMyGame(myCompetition);

      // my team（teams 一覧から、competition に参加かつ自分が所属するチームを特定）
      const myTeam = teams.find(
        (t) =>
          myTeamIds.includes(t.id) &&
          myCompetition.teams.some((ct) => ct.id === t.id)
      );
      if (!myTeam) break fetchBlock;
      setMyTeam(myTeam);

      // my team users（team.users から取得）
      setMyTeamUsers(myTeam.users);

      // my sport
      const mySport = sports.find((s) =>
        s.scene?.some((ss) => ss.scene.id === myCompetition.scene.id)
      );
      if (!mySport) break fetchBlock;
      setMySport(mySport);

      // my competition matches → my team matches
      const myCompetitionMatches = matches.filter(
        (m) => m.competition.id === myCompetition.id
      );
      const myTeamMatches = myCompetitionMatches.filter((m) =>
        m.entries.some((e) => e.team?.id === myTeam.id)
      );
      setMyTeamMatches(myTeamMatches);

      // 【未確定】league/tournament 順位は leagueStandings / tournamentRanking クエリで対応予定（TASK-005+）
      setMyTeamRank(0);

      // 自分のチームが審判を担当する試合
      const myJudgeMatches = matches.filter(
        (m) => m.judgment?.team?.id === myTeam.id
      );
      setMyJudgeMatches(myJudgeMatches);
    }

    setIsFetching(false);
  }

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
  } as DashboardDataType;
};
