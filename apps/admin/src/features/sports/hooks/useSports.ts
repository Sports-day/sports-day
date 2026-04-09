import { useGetAdminSportsQuery } from '@/gql/__generated__/graphql'
import type { Sport } from '../types'

export function useSports() {
  const { data, loading, error } = useGetAdminSportsQuery()
  const sports: Sport[] = (data?.sports ?? []).map(s => ({
    id: s.id,
    name: s.name,
    weight: s.weight,
    imageUrl: s.image?.url ?? '',
    sceneNames: (s.scene ?? []).map(sc => sc.scene.name),
  }))
  return { data: sports, loading, error: error ?? null }
}
