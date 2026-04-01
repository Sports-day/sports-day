import { useState } from 'react'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '../mock'

export function useLeagueRegenerate(competitionId: string, leagueId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const openOverlay = () => setIsOpen(true)

  const closeOverlay = () => {
    setIsOpen(false)
    setSelectedLocation('')
    setIsConfirmOpen(false)
  }

  const openConfirm = () => setIsConfirmOpen(true)

  const closeConfirm = () => setIsConfirmOpen(false)

  const confirmSave = () => {
    const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []
    MOCK_ACTIVE_LEAGUES[competitionId] = leagues.map((l) =>
      l.id === leagueId
        ? {
            ...l,
            matches: l.matches.map((m) => ({
              ...m,
              scoreA: 0,
              scoreB: 0,
              status: 'standby' as const,
            })),
          }
        : l,
    )
    persistActiveLeagues()
    closeOverlay()
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
  }
}
