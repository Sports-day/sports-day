import { useMemo, useCallback } from 'react'
import { useGetAdminSportsQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'
import type { Sport } from '../types'

export function useSports() {
  const { data, loading, error } = useGetAdminSportsQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'scene'])

  const sports: Sport[] = (data?.sports ?? []).map(s => ({
    id: s.id,
    name: s.name,
    displayOrder: s.displayOrder,
    imageUrl: s.image?.url ?? '',
    sceneNames: (s.scene ?? []).map(sc => sc.scene.name),
    scenes: (s.scene ?? []).map(sc => ({ sceneId: sc.scene.id, sceneName: sc.scene.name })),
  }))

  const keyword = fp.keyword
  const sceneFilter = fp.scene

  const sceneOptions = useMemo(() => {
    const set = new Set<string>()
    for (const s of sports) {
      for (const name of s.sceneNames) set.add(name)
    }
    return Array.from(set).sort().map(name => ({ value: name, label: name }))
  }, [sports])

  const filtered = useMemo(() => {
    let result = sports
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(kw))
    }
    if (sceneFilter) result = result.filter(s => s.sceneNames.includes(sceneFilter))
    return result
  }, [sports, keyword, sceneFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  return {
    data: filtered,
    allData: sports,
    keyword,
    sceneFilter,
    sceneOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error: error ?? null,
  }
}
