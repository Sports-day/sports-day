import { useGetPanelMeQuery } from "@/src/gql/__generated__/graphql";

export const useFetchUserinfo = () => {
  const { data, loading } = useGetPanelMeQuery();
  return {
    user: data?.me,
    isFetching: loading,
  };
};
