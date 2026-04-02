import {
  useGetPanelLocationsQuery,
  useGetPanelLocationQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchLocations = () => {
  const { data, loading, refetch } = useGetPanelLocationsQuery();
  return {
    locations: data?.locations ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchLocation = (locationId: string) => {
  const { data, loading, refetch } = useGetPanelLocationQuery({
    variables: { id: locationId },
    skip: !locationId,
  });
  return {
    location: data?.location,
    isFetching: loading,
    refresh: refetch,
  };
};
