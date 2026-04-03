import {
  useGetPanelScenesQuery,
  useGetPanelSceneQuery,
} from "@/src/gql/__generated__/graphql";

// tags = scenes（同義語）。TagRepository → Scene クエリにマッピング
export const useFetchTags = () => {
  const { data, loading, refetch } = useGetPanelScenesQuery();
  return {
    tags: data?.scenes ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchTag = (tagId: string) => {
  const { data, loading, refetch } = useGetPanelSceneQuery({
    variables: { id: tagId },
    skip: !tagId,
  });
  return {
    tag: data?.scene,
    isFetching: loading,
    refresh: refetch,
  };
};
