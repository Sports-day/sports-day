import { useGetAdminImagesQuery } from '@/gql/__generated__/graphql'
import type { Image } from '../types'

export function useImages() {
  const { data, loading, error } = useGetAdminImagesQuery()
  const images: Image[] = (data?.images ?? []).map(i => ({
    id: i.id,
    url: i.url ?? '',
    status: i.status,
    displayOrder: i.displayOrder,
  }))
  return { data: images, loading, error: error ?? null }
}
