import {
  useGetPanelSportsQuery,
  useGetPanelSportQuery,
  useGetPanelMatchesQuery,
  MatchStatus,
} from "@/src/gql/__generated__/graphql";

export const useFetchSports = (_filter: boolean = false) => {
  const { data, loading, refetch } = useGetPanelSportsQuery();
  return {
    sports: data?.sports ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchSport = (sportId: string) => {
  const { data, loading, refetch } = useGetPanelSportQuery({
    variables: { id: sportId },
    skip: !sportId,
  });
  return {
    sport: data?.sport,
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchSportProgress = (sportId: string | number) => {
  const sportIdStr = String(sportId)
  const { sport, isFetching: isSportFetching } = useFetchSport(sportIdStr)
  const { data: matchesData, loading: isMatchesFetching } = useGetPanelMatchesQuery()

  // sportId に一致する competition の match を抽出
  const sportMatches = (matchesData?.matches ?? []).filter(m =>
    m.competition.sport?.id === sportIdStr
  )

  const total = sportMatches.length
  const finished = sportMatches.filter(m => m.status === MatchStatus.Finished).length
  const progress = total > 0 ? finished / total : 0

  return {
    progress,
    isFetching: isSportFetching || isMatchesFetching,
    refresh: () => Promise.resolve({}),
  };
};
