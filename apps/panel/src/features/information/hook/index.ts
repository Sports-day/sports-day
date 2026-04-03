import {
  useGetPanelInformationsQuery,
  useGetPanelInformationQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchAllInformation = () => {
  const { data, loading, refetch } = useGetPanelInformationsQuery();
  const allInformation = (data?.Informations ?? []).filter(
    (i) => i.status === "published"
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
