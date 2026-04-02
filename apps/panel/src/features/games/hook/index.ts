import {
  useGetPanelCompetitionsQuery,
  useGetPanelCompetitionQuery,
} from "@/src/gql/__generated__/graphql";

// games = competitions（同義語）。GameRepository → Competition クエリにマッピング

export const useFetchGames = (_filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelCompetitionsQuery();
  return {
    games: data?.competitions ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchGame = (gameId: string) => {
  const { data, loading, refetch } = useGetPanelCompetitionQuery({
    variables: { id: gameId },
    skip: !gameId,
  });
  return {
    game: data?.competition,
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchGameMatches = (gameId: string) => {
  const { data, loading, refetch } = useGetPanelCompetitionQuery({
    variables: { id: gameId },
    skip: !gameId,
  });
  return {
    matches: data?.competition?.matches ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchGameEntries = (gameId: string) => {
  const { data, loading, refetch } = useGetPanelCompetitionQuery({
    variables: { id: gameId },
    skip: !gameId,
  });
  return {
    teams: data?.competition?.teams ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

// 【未確定】leagueStandings / tournamentRanking クエリへの移行は TASK-005 で対応
export const useFetchGameResult = (_gameId: string) => {
  return {
    result: undefined,
    isFetching: false,
    refresh: () => {},
  };
};

// 【未確定】leagueStandings / tournamentRanking クエリへの移行は TASK-005 で対応
export const useFetchGameResultWithoutFetchGame = (_game: unknown, _restrict: boolean = true) => {
  return {
    result: undefined,
    isFetching: false,
    refresh: () => {},
  };
};

export const useFetchTeamGames = (teamId: string) => {
  // team.competitions を利用（competitions に team でフィルタは GQL 側で解決済み）
  // 現在の GetPanelCompetitions はフィルタ未対応のため全件返す
  // 【未確定】team 固有の competitions フィルタは TASK-005 で対応
  const { data, loading, refetch } = useGetPanelCompetitionsQuery({
    skip: !teamId,
  });
  return {
    games: data?.competitions ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};
