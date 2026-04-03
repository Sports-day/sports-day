import { useGetAdminScenesForTagsQuery } from '@/gql/__generated__/graphql'
import type { Tag } from '../types'

export function useTags() {
  const { data, loading, error } = useGetAdminScenesForTagsQuery()

  const tags: Tag[] = (data?.scenes ?? []).map(s => ({
    id: s.id,
    name: s.name,
    isDeleted: s.isDeleted,
  }))

  return { data: tags, loading, error: error ?? null }
}
