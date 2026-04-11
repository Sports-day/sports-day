import { useMemo, useCallback } from 'react'
import { useGetAdminCompetitionsQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Competition } from '../types'

export function useCompetitions() {
  const { data, loading, error } = useGetAdminCompetitionsQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'type', 'sport', 'scene'])

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

  const keyword = fp.keyword
  const typeFilter = fp.type
  const sportFilter = fp.sport
  const sceneFilter = fp.scene

  const sportOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of competitions) {
      if (!map.has(c.sportId)) map.set(c.sportId, c.sportName)
    }
    return Array.from(map, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [competitions])

  const sceneOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of competitions) {
      if (c.sceneName) set.add(c.sceneName)
    }
    return Array.from(set).sort().map(name => ({ value: name, label: name }))
  }, [competitions])

  const filtered = useMemo(() => {
    let result = competitions
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(kw) ||
        c.sportName.toLowerCase().includes(kw) ||
        c.sceneName.toLowerCase().includes(kw)
      )
    }
    if (typeFilter) result = result.filter(c => c.type === typeFilter)
    if (sportFilter) result = result.filter(c => c.sportId === sportFilter)
    if (sceneFilter) result = result.filter(c => c.sceneName === sceneFilter)
    return result
  }, [competitions, keyword, typeFilter, sportFilter, sceneFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  return {
    data: filtered,
    allData: competitions,
    keyword,
    typeFilter,
    sportFilter,
    sceneFilter,
    sportOptions,
    sceneOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error: error ?? null,
  }
}
