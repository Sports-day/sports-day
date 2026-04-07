import {
  useGetPanelCompetitionsQuery,
  useGetPanelLeagueStandingsQuery,
  useGetPanelTournamentRankingQuery,
  CompetitionType,
  GetPanelCompetitionsQuery,
} from "@/src/gql/__generated__/graphql";

type GqlCompetition = GetPanelCompetitionsQuery["competitions"][0];

export const useFetchGames = (_filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelCompetitionsQuery();
  return {
    games: data?.competitions ?? [],
    isFetching: loading,
    refresh: refetch,
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
