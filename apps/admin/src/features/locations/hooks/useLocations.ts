import { useGetAdminLocationsQuery } from '@/gql/__generated__/graphql'

export function useLocations() {
  const { data, loading, error } = useGetAdminLocationsQuery()
  const locations = (data?.locations ?? []).map(l => ({
    id: l.id,
    name: l.name,
    description: '', // 【未確定】GraphQL Location に description はない
  }))
  return { data: locations, loading, error: error ?? null }
}
