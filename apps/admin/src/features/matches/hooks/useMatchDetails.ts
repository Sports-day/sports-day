import { useState } from 'react'
import type { ActiveMatch } from '../types'
import {
  useUpdateAdminMatchDetailMutation,
  useGetAdminLocationsForMatchesQuery,
} from '@/gql/__generated__/graphql'

export function useMatchDetails(match: ActiveMatch) {
  const [open, setOpen] = useState(false)
  const [locationId, setLocationId] = useState(match.locationId ?? '')
  const [startTime, setStartTime] = useState(match.startTime ?? new Date().toISOString().slice(0, 16))

  const [updateMatchDetail] = useUpdateAdminMatchDetailMutation()
  const { data: locationsData } = useGetAdminLocationsForMatchesQuery()
  const locations = locationsData?.locations ?? []

  const handleSave = () => {
    updateMatchDetail({
      variables: {
        id: match.id,
        input: {
          time: startTime,
          locationId,
        },
      },
      refetchQueries: ['GetAdminMatches'],
    }).then(() => setOpen(false)).catch(() => {})
  }

  const handleReset = () => {
    setLocationId(match.locationId ?? '')
    setStartTime(match.startTime ?? new Date().toISOString().slice(0, 16))
  }

  return {
    open,
    setOpen,
    locationId,
    setLocationId,
    locations,
    startTime,
    setStartTime,
    handleSave,
    handleReset,
  }
}
