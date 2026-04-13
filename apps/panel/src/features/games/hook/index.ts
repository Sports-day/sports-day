import {
  useGetPanelCompetitionsQuery,
  useGetPanelLeagueStandingsQuery,
  useGetPanelTournamentRankingQuery,
  CompetitionType,
  GetPanelCompetitionsQuery,
} from "@/src/gql/__generated__/graphql";

type GqlCompetition = GetPanelCompetitionsQuery["competitions"][0];

export const useFetchGames = (_filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelCompetitionsQuery({
    errorPolicy: 'all',
  });
  return {
    games: (data?.competitions ?? []).filter(Boolean),
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchGameResultWithoutFetchGame = (game: GqlCompetition | null | undefined, _restrict: boolean = true) => {
  const leagueId = game?.league?.id ?? '';
  const isLeague = game?.type === CompetitionType.League;

  const { data: standingsData, loading: isStandingsFetching, refetch: refetchStandings } = useGetPanelLeagueStandingsQuery({
    variables: { leagueId },
    skip: !leagueId || !isLeague,
  });
  const { data: rankingData, loading: isRankingFetching, refetch: refetchRanking } = useGetPanelTournamentRankingQuery({
    variables: { competitionId: game?.id ?? '' },
    skip: !game?.id || isLeague,
  });

  const result = isLeague
    ? (standingsData?.leagueStandings ?? undefined)
    : (rankingData?.tournamentRanking ?? undefined);

  return {
    result,
    isFetching: isStandingsFetching || isRankingFetching,
    refresh: () => {
      if (isLeague) refetchStandings();
      else refetchRanking();
    },
  };
};
