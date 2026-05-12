import { useState } from 'react'
import { useGenerateAdminRoundRobinMutation, useGetAdminCompetitionQuery } from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export function useLeagueRegenerate(competitionId: string, leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [generateRoundRobin] = useGenerateAdminRoundRobinMutation()

  // 競技に保存済みの時間設定を取得し、再生成時に反映する
  const { data: compData } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
    fetchPolicy: 'cache-and-network',
  })

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
      const comp = compData?.competition
      const startTime = comp?.startTime
        ? new Date(comp.startTime).toISOString()
        : new Date().toISOString()
      const matchDuration = comp?.matchDuration ?? 15
      const breakDuration = comp?.breakDuration ?? 5

      await generateRoundRobin({
        variables: {
          id: leagueId,
          input: {
            startTime,
            matchDuration,
            breakDuration,
            locationId: selectedLocation || undefined,
          },
        },
        refetchQueries: ['GetAdminCompetitionMatches'],
      })
      setMutationError(null)
      closeOverlay()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
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
