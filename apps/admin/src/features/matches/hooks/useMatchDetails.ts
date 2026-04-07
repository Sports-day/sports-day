import { useState } from 'react'
import type { ActiveMatch } from '../types'
import {
  useUpdateAdminMatchDetailMutation,
  useGetAdminLocationsForMatchesQuery,
} from '@/gql/__generated__/graphql'

export function useMatchDetails(match: ActiveMatch) {
  const [open, setOpen] = useState(false)
  const [locationId, setLocationId] = useState(match.locationId ?? '')
  const [time, setTime] = useState(match.time ?? new Date().toISOString().slice(0, 16))
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [updateMatchDetail] = useUpdateAdminMatchDetailMutation()
  const { data: locationsData } = useGetAdminLocationsForMatchesQuery()
  const locations = locationsData?.locations ?? []

  const handleSave = async () => {
    try {
      await updateMatchDetail({
        variables: {
          id: match.id,
          input: {
            time,
            locationId,
          },
        },
        refetchQueries: ['GetAdminCompetitionMatches'],
      })
      setMutationError(null)
      setOpen(false)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const handleReset = () => {
    setLocationId(match.locationId ?? '')
    setTime(match.time ?? new Date().toISOString().slice(0, 16))
  }

  return {
    open,
    setOpen,
    locationId,
    setLocationId,
    locations,
    time,
    setTime,
    handleSave,
    handleReset,
    error: mutationError,
  }
}
