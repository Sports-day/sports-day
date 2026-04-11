import { useMemo } from 'react'
import { useGetAdminLocationsQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Location } from '../types'

export function useLocations() {
  const { data, loading, error } = useGetAdminLocationsQuery()
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword'])

  const locations: Location[] = (data?.locations ?? []).map(l => ({
    id: l.id,
    name: l.name,
    displayOrder: l.displayOrder,
  }))

  const keyword = fp.keyword

  const filtered = useMemo(() => {
    if (!keyword) return locations
    const kw = keyword.toLowerCase()
    return locations.filter(l => l.name.toLowerCase().includes(kw))
  }, [locations, keyword])

  return { data: filtered, allData: locations, keyword, setFilter, resetFilters, loading, error: error ?? null }
}
