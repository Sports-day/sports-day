import { useMemo } from "react";
import { useGetPanelMeQuery } from "@/src/gql/__generated__/graphql";
import { useMsGraphUsers } from "@/src/hooks/useMsGraphUsers";

export const useFetchUserinfo = () => {
  const { data, loading } = useGetPanelMeQuery();
  const msIds = useMemo(
    () => [data?.me?.identify?.microsoftUserId].filter((id): id is string => !!id),
    [data],
  );
  const { msGraphUsers, loading: msGraphLoading } = useMsGraphUsers(msIds);

  const user = useMemo(() => {
    if (!data?.me) return undefined;
    const msId = data.me.identify?.microsoftUserId;
    const msUser = msId ? msGraphUsers.get(msId) : undefined;
    return {
      ...data.me,
      name: msUser?.displayName ?? data.me.name ?? '',
    };
  }, [data, msGraphUsers]);

  return {
    user,
    isFetching: loading || msGraphLoading,
  };
};
