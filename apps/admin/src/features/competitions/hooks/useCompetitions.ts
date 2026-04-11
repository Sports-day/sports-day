import { useGetAdminCompetitionsQuery } from '@/gql/__generated__/graphql'
import type { Competition } from '../types'

export function useCompetitions() {
  const { data, loading, error } = useGetAdminCompetitionsQuery({ fetchPolicy: 'cache-and-network' })
  const competitions: Competition[] = (data?.competitions ?? []).map(c => ({
    id: c.id,
    name: c.name,
    displayOrder: c.displayOrder,
    type: c.type,
    sceneId: c.scene.id,
    sceneName: c.scene.name,
    sportId: c.sport.id,
    sportName: c.sport.name,
  }))
  return { data: competitions, loading, error: error ?? null }
}
