import {
  useGetPanelCompetitionsQuery,
  useGetPanelCompetitionQuery,
  useGetPanelLeagueStandingsQuery,
  useGetPanelTournamentRankingQuery,
  CompetitionType,
  GetPanelCompetitionsQuery,
} from "@/src/gql/__generated__/graphql";

type GqlCompetition = GetPanelCompetitionsQuery["competitions"][0];

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

export const useFetchGameResult = (gameId: string) => {
  const { data: compData, loading: isCompFetching } = useGetPanelCompetitionQuery({
    variables: { id: gameId },
    skip: !gameId,
  });
  const competition = compData?.competition;
  const leagueId = (competition as GqlCompetition | undefined)?.league?.id ?? '';
  const isLeague = competition?.type === CompetitionType.League;

  const { data: standingsData, loading: isStandingsFetching } = useGetPanelLeagueStandingsQuery({
    variables: { leagueId },
    skip: !leagueId || !isLeague,
  });
  const { data: rankingData, loading: isRankingFetching } = useGetPanelTournamentRankingQuery({
    variables: { competitionId: gameId },
    skip: !gameId || isLeague,
  });

  const result = isLeague
    ? (standingsData?.leagueStandings ?? undefined)
    : (rankingData?.tournamentRanking ?? undefined);

  return {
    result,
    isFetching: isCompFetching || isStandingsFetching || isRankingFetching,
    refresh: () => {},
  };
};

export const useFetchGameResultWithoutFetchGame = (game: GqlCompetition | null | undefined, _restrict: boolean = true) => {
  const leagueId = game?.league?.id ?? '';
  const isLeague = game?.type === CompetitionType.League;

  const { data: standingsData, loading: isStandingsFetching } = useGetPanelLeagueStandingsQuery({
    variables: { leagueId },
    skip: !leagueId || !isLeague,
  });
  const { data: rankingData, loading: isRankingFetching } = useGetPanelTournamentRankingQuery({
    variables: { competitionId: game?.id ?? '' },
    skip: !game?.id || isLeague,
  });

  const result = isLeague
    ? (standingsData?.leagueStandings ?? undefined)
    : (rankingData?.tournamentRanking ?? undefined);

  return {
    result,
    isFetching: isStandingsFetching || isRankingFetching,
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
