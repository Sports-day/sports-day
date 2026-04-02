import {
  useGetPanelGroupsQuery,
  useGetPanelGroupQuery,
} from "@/src/gql/__generated__/graphql";

// classes = groups（同義語）。ClassRepository → Group クエリにマッピング
export const useFetchClasses = () => {
  const { data, loading, refetch } = useGetPanelGroupsQuery();
  return {
    classes: data?.groups ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchClass = (id: string) => {
  const { data, loading, refetch } = useGetPanelGroupQuery({
    variables: { id },
    skip: !id,
  });
  return {
    classModel: data?.group,
    isFetching: loading,
    refresh: refetch,
  };
};
