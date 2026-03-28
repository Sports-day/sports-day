import { useState } from 'react'
import { MOCK_ACTIVE_LEAGUES } from '../mock'

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
    const league = leagues.find((l) => l.id === leagueId)
    if (league) {
      league.matches.forEach((m) => {
        m.scoreA = 0
        m.scoreB = 0
        m.status = 'standby'
      })
    }
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
