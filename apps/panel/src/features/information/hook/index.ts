import {
  useGetPanelInformationsQuery,
  useGetPanelInformationQuery,
} from "@/src/gql/__generated__/graphql";

function isVisible(status: string, scheduledAt?: string | null): boolean {
  if (status === "published") return true;
  if (status === "scheduled" && scheduledAt) {
    return new Date(scheduledAt) <= new Date();
  }
  return false;
}

export const useFetchAllInformation = () => {
  const { data, loading, refetch } = useGetPanelInformationsQuery();
  const allInformation = (data?.Informations ?? []).filter((i) =>
    isVisible(i.status, i.scheduledAt)
  );
  return {
    allInformation,
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchInformation = (informationId: string) => {
  const { data, loading, refetch } = useGetPanelInformationQuery({
    variables: { id: informationId },
    skip: !informationId,
  });
  return {
    information: data?.Information,
    isFetching: loading,
    refresh: refetch,
  };
};
