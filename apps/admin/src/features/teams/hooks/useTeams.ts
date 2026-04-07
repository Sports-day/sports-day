import { useGetAdminTeamsQuery } from '@/gql/__generated__/graphql'
import type { Team } from '../types'

export function useTeams() {
  const { data, loading, error } = useGetAdminTeamsQuery()
  const teams: Team[] = (data?.teams ?? []).map(t => ({
    id: t.id,
    name: t.name,
    groupName: t.group.name,
  }))
  return { data: teams, loading, error: error ?? null }
}
