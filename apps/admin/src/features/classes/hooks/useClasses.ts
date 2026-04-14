import { useMemo } from 'react'
import { useGetAdminGroupsForClassesQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Class } from '../types'

export function useClasses() {
  const { data, loading, error } = useGetAdminGroupsForClassesQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword'])

  const classes: Class[] = (data?.groups ?? []).map(g => ({
    id: g.id,
    name: g.name,
    memberCount: g.users.length,
  }))

  const keyword = fp.keyword

  const filtered = useMemo(() => {
    if (!keyword) return classes
    const kw = keyword.toLowerCase()
    return classes.filter(c => c.name.toLowerCase().includes(kw))
  }, [classes, keyword])

  return { data: filtered, allData: classes, keyword, setFilter, resetFilters, loading, error: error ?? null }
}
