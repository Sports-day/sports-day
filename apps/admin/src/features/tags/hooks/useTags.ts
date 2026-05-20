import { useMemo, useCallback } from 'react'
import { useGetAdminScenesForTagsQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Tag } from '../types'

export function useTags() {
  const { data, loading, error } = useGetAdminScenesForTagsQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'status'])

  const tags: Tag[] = (data?.scenes ?? []).map(s => ({
    id: s.id,
    name: s.name,
    displayOrder: s.displayOrder,
    enable: s.enable,
  }))

  const keyword = fp.keyword
  const statusFilter = fp.status

  const filtered = useMemo(() => {
    let result = tags
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(kw))
    }
    if (statusFilter === 'active') result = result.filter(t => t.enable)
    if (statusFilter === 'disabled') result = result.filter(t => !t.enable)
    return result
  }, [tags, keyword, statusFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  return {
    data: filtered,
    allData: tags,
    keyword,
    statusFilter,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error: error ?? null,
  }
}
