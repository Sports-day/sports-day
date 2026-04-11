import { useMemo } from "react";
import {
  useGetPanelUsersQuery,
  useGetPanelUserQuery,
} from "@/src/gql/__generated__/graphql";
import { useMsGraphUsers } from "@/src/hooks/useMsGraphUsers";

export type ResolvedUser = ReturnType<typeof useFetchUsers>["users"][number];

export const useFetchUsers = () => {
  const { data, loading, refetch } = useGetPanelUsersQuery();

  const microsoftUserIds = useMemo(
    () =>
      (data?.users ?? [])
        .map((u) => u.identify?.microsoftUserId)
        .filter((id): id is string => !!id),
    [data],
  );

  const { msGraphUsers, loading: msGraphLoading } =
    useMsGraphUsers(microsoftUserIds);

  const users = useMemo(
    () =>
      (data?.users ?? []).map((u) => {
        const msId = u.identify?.microsoftUserId;
        const msUser = msId ? msGraphUsers.get(msId) : undefined;
        return {
          ...u,
          name: msUser?.displayName ?? u.name ?? '',
          email: msUser?.mail ?? u.email ?? '',
        };
      }),
    [data, msGraphUsers],
  );

  return {
    users,
    isFetching: loading || msGraphLoading,
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
