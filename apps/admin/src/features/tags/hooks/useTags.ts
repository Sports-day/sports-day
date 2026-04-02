import { useState, useEffect } from 'react'
import { useGetAdminScenesForTagsQuery } from '@/gql/__generated__/graphql'
import type { Tag } from '../types'

export function useTags() {
  const { data, loading, error } = useGetAdminScenesForTagsQuery()

  // enabled はローカル状態のみ 【未確定】GraphQL Scene に enabled はない
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (data?.scenes) {
      setEnabledMap(prev => {
        const next = { ...prev }
        data.scenes.forEach(s => { if (!(s.id in next)) next[s.id] = true })
        return next
      })
    }
  }, [data?.scenes])

  const tags: Tag[] = (data?.scenes ?? []).map(s => ({
    id: s.id,
    name: s.name,
    enabled: enabledMap[s.id] ?? true,
  }))

  const toggleTag = (id: string) => {
    setEnabledMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return { data: tags, loading, error: error ?? null, toggleTag }
}
