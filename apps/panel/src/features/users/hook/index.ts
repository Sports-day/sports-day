import {
  useGetPanelUsersQuery,
  useGetPanelUserQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchUsers = () => {
  const { data, loading, refetch } = useGetPanelUsersQuery();
  return {
    users: data?.users ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchUser = (userId: string) => {
  const { data, loading, refetch } = useGetPanelUserQuery({
    variables: { id: userId },
    skip: !userId,
  });
  return {
    user: data?.user,
    isFetching: loading,
    refresh: refetch,
  };
};
