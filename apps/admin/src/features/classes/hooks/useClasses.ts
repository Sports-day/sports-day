import { useGetAdminGroupsForClassesQuery } from '@/gql/__generated__/graphql'
import type { Class } from '../types'

export function useClasses() {
  const { data, loading, error } = useGetAdminGroupsForClassesQuery()

  const classes: Class[] = (data?.groups ?? []).map(g => ({
    id: g.id,
    name: g.name,
    memberCount: g.users.length,
  }))

  return { data: classes, loading, error: error ?? null }
}
