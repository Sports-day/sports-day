import {
  useGetPanelTeamsQuery,
  useGetPanelTeamQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchTeams = () => {
  const { data, loading, refetch } = useGetPanelTeamsQuery();
  return {
    teams: data?.teams ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchTeam = (teamId: string) => {
  const { data, loading, refetch } = useGetPanelTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
  });
  return {
    team: data?.team,
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchTeamUsers = (teamId: string) => {
  const { data, loading, refetch } = useGetPanelTeamQuery({
    variables: { id: teamId },
    skip: !teamId,
  });
  return {
    users: data?.team?.users ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};
