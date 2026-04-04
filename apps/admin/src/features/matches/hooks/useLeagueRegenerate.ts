import { useState } from 'react'
import { useGenerateAdminRoundRobinMutation } from '@/gql/__generated__/graphql'

export function useLeagueRegenerate(_competitionId: string, leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [generateRoundRobin] = useGenerateAdminRoundRobinMutation()

  const openOverlay = () => setIsOpen(true)

  const closeOverlay = () => {
    setIsOpen(false)
    setSelectedLocation('')
    setIsConfirmOpen(false)
  }

  const openConfirm = () => setIsConfirmOpen(true)
  const closeConfirm = () => setIsConfirmOpen(false)

  const confirmSave = async () => {
    try {
      await generateRoundRobin({
        variables: {
          id: leagueId,
          input: {
            startTime: new Date().toISOString(),
            matchDuration: 15,
            breakDuration: 5,
            locationId: selectedLocation || undefined,
          },
        },
        refetchQueries: ['GetAdminMatches'],
      })
      setMutationError(null)
      closeOverlay()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  return {
    isOpen,
    selectedLocation,
    setSelectedLocation,
    isConfirmOpen,
    openOverlay,
    closeOverlay,
    openConfirm,
    closeConfirm,
    confirmSave,
    error: mutationError,
  }
}
