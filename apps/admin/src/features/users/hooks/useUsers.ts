import { useGetAdminUsersQuery } from '@/gql/__generated__/graphql'
import type { User } from '../types'

export function useUsers() {
  const { data, loading, error } = useGetAdminUsersQuery()
  const users: User[] = (data?.users ?? []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    gender: (u.gender ?? '') as '男性' | '女性',
    class: u.groups[0]?.name ?? '',
    teams: u.teams.map(t => t.id),
    role: undefined,
  }))
  return { data: users, loading, error: error ?? null }
}
