import { useFetchUsers } from "@/src/features/users/hook";
import { useFetchTeams } from "@/src/features/teams/hook";
import { useFetchSports } from "@/src/features/sports/hook";
import { useFetchMatches } from "@/src/features/matches/hook";
import { useFetchUserinfo } from "@/src/features/userinfo/hook";
import { useState } from "react";
import {
  GetPanelMatchesQuery,
  GetPanelTeamsQuery,
  GetPanelUsersQuery,
  GetPanelSportsQuery,
  GetPanelMeQuery,
  MatchStatus,
} from "@/src/gql/__generated__/graphql";

// GraphQL 生成型エイリアス
type GqlMatch = GetPanelMatchesQuery["matches"][0];
type GqlTeam = GetPanelTeamsQuery["teams"][0];
type GqlUser = GetPanelUsersQuery["users"][0];
type GqlSport = GetPanelSportsQuery["sports"][0];
type GqlGroup = GetPanelMeQuery["me"]["groups"][0]; // class = group の同義語

export type MatchSet = {
  match: GqlMatch;
  team: GqlTeam;
  members: GqlTeam["users"];
  sport: GqlSport;
  game: GqlMatch["competition"]; // game = competition の同義語
};

export type TeamSetsInMyClassResponse = {
  isFetching: boolean;
  isSuccessful: boolean;
  myClass: GqlGroup | undefined; // class = group の同義語
  users: GqlUser[];
  matchSets: MatchSet[];
};

export const useFetchTeamSetsInMyClass = () => {
  const { users, isFetching: isFetchingUsers } = useFetchUsers();
  const { teams, isFetching: isFetchingTeams } = useFetchTeams();
  const { sports, isFetching: isFetchingSports } = useFetchSports(true);
  const { matches, isFetching: isFetchingMatches } = useFetchMatches();
  const { user, isFetching: isFetchingMyUser } = useFetchUserinfo();

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isSuccessfulState, setIsSuccessfulState] = useState<boolean>(false);
  const [myClassState, setMyClassState] = useState<GqlGroup | undefined>(undefined);
  const [matchSetListState, setMatchSetListState] = useState<MatchSet[]>([]);

  if (
    !isFetchingUsers &&
    !isFetchingTeams &&
    !isFetchingSports &&
    !isFetchingMatches &&
    !isFetchingMyUser &&
    isFetching
  ) {
    fetchBlock: {
      if (!user) break fetchBlock;

      // me.groups[0] → 自分のグループ（= クラス）
      const myGroup = user.groups[0];
      if (!myGroup) break fetchBlock;
      setMyClassState(myGroup);

      // 同じグループに属するチームを抽出
      const findTeams = teams.filter((t) => t.group.id === myGroup.id);

      const matchSetList: MatchSet[] = [];

      for (const team of findTeams) {
        // チームのメンバーは team.users から取得（REST の userIds 廃止）
        const findMembers = team.users;

        // チームが参加する未終了の試合を抽出
        const findMatches = matches
          .filter((m) =>
            m.entries.some((e) => e.team?.id === team.id)
          )
          .filter((m) => m.status !== MatchStatus.Finished);

        for (const match of findMatches) {
          // competition.scene.id → sport を逆引き
          const sceneId = match.competition.scene.id;
          const findSport = sports.find((s) =>
            s.scene?.some((ss) => ss.scene.id === sceneId)
          );

          if (!findSport) {
            continue;
          }

          const matchSet: MatchSet = {
            match,
            team,
            members: findMembers,
            sport: findSport,
            game: match.competition, // game = competition
          };

          matchSetList.push(matchSet);
        }
      }

      // 試合開始時刻でソート（startAt → time に変更）
      const sortedMatchSetList = matchSetList.sort((a, b) =>
        a.match.time.localeCompare(b.match.time)
      );

      setMatchSetListState(sortedMatchSetList);
      setIsSuccessfulState(true);
    }

    setIsFetching(false);
  }

  return {
    isFetching,
    isSuccessful: isSuccessfulState,
    myClass: myClassState,
    users: users,
    matchSets: matchSetListState,
  } as TeamSetsInMyClassResponse;
};
