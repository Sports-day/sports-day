import { useMemo, useCallback } from 'react'
import { useGetAdminTeamsQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Team } from '../types'

export function useTeams() {
  const { data, loading, error } = useGetAdminTeamsQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'group'])

  const teams: Team[] = (data?.teams ?? []).map(t => ({
    id: t.id,
    name: t.name,
    groupName: t.group.name,
  }))

  const keyword = fp.keyword
  const groupFilter = fp.group

  const groupOptions = useMemo(() => {
    const set = new Map<string, string>()
    for (const t of teams) {
      if (t.groupName && !set.has(t.groupName)) set.set(t.groupName, t.groupName)
    }
    return Array.from(set, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [teams])

  const filtered = useMemo(() => {
    let result = teams
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(kw) ||
        t.groupName.toLowerCase().includes(kw)
      )
    }
    if (groupFilter) result = result.filter(t => t.groupName === groupFilter)
    return result
  }, [teams, keyword, groupFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  return {
    data: filtered,
    allData: teams,
    keyword,
    groupFilter,
    groupOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error: error ?? null,
  }
}
