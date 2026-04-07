import { useGetAdminUsersQuery } from '@/gql/__generated__/graphql'
import type { User } from '../types'

export function useUsers() {
  const { data, loading, error } = useGetAdminUsersQuery()
  const users: User[] = (data?.users ?? []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    gender: u.gender ?? '',
    role: u.role,
    groupName: u.groups[0]?.name ?? '',
    teams: u.teams.map(t => ({ id: t.id, name: t.name })),
  }))
  return { data: users, loading, error: error ?? null }
}
