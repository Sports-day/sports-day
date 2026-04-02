import { useGetAdminImagesQuery } from '@/gql/__generated__/graphql'

export function useImages() {
  const { data, loading, error } = useGetAdminImagesQuery()
  const images = (data?.images ?? []).map(i => ({
    id: i.id,
    name: '', // 【未確定】GraphQL Image に name はない
    url: i.url ?? '',
  }))
  return { data: images, loading, error: error ?? null }
}
