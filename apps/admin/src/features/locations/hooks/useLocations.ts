import { useGetAdminLocationsQuery } from '@/gql/__generated__/graphql'
import type { Location } from '../types'

export function useLocations() {
  const { data, loading, error } = useGetAdminLocationsQuery()
  const locations: Location[] = (data?.locations ?? []).map(l => ({
    id: l.id,
    name: l.name,
  }))
  return { data: locations, loading, error: error ?? null }
}
