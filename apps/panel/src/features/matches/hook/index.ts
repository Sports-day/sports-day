import {
  useGetPanelMatchesQuery,
  useGetPanelMatchQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchMatches = () => {
  const { data, loading, refetch } = useGetPanelMatchesQuery({
    errorPolicy: 'all',
  });
  return {
    matches: (data?.matches ?? []).filter(m => m && !m.competition?.scene?.isDeleted),
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchMatch = (matchId: string) => {
  const { data, loading, refetch } = useGetPanelMatchQuery({
    variables: { id: matchId },
    skip: !matchId,
  });
  return {
    match: data?.match,
    isFetching: loading,
    refresh: refetch,
  };
};
