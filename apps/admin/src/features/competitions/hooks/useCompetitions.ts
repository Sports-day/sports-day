import { useGetAdminCompetitionsQuery } from '@/gql/__generated__/graphql'
import type { Competition } from '../types'

export function useCompetitions() {
  const { data, loading, error } = useGetAdminCompetitionsQuery()
  const competitions: Competition[] = (data?.competitions ?? []).map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    sceneName: c.scene.name,
  }))
  return { data: competitions, loading, error: error ?? null }
}
