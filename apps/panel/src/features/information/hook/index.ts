import {
  useGetPanelInformationsQuery,
  useGetPanelInformationQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchAllInformation = () => {
  const { data, loading, refetch } = useGetPanelInformationsQuery();
  return {
    allInformation: data?.Informations ?? [],
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
