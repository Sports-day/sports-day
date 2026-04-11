import {
  useGetPanelImagesQuery,
  useGetPanelImageQuery,
} from "@/src/gql/__generated__/graphql";

export const useFetchImages = () => {
  const { data, loading, refetch } = useGetPanelImagesQuery();
  return {
    images: data?.images ?? [],
    isFetching: loading,
    refresh: refetch,
  };
};

export const useFetchImage = (imageId: string) => {
  const { data, loading, refetch } = useGetPanelImageQuery({
    variables: { id: imageId },
    skip: !imageId,
  });
  return {
    image: data?.image,
    isFetching: loading,
    refresh: refetch,
  };
};
