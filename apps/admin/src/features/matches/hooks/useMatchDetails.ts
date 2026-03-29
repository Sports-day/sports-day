import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { MOCK_ACTIVE_LEAGUES } from '../mock'

export function useMatchDetails(match: ActiveMatch) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(match.note ?? '')
  const [referee, setReferee] = useState(match.referee ?? '')
  const [location, setLocation] = useState(match.location ?? '1')
  const [startTime, setStartTime] = useState(match.startTime ?? '2026-03-25T22:48')

  const handleSave = () => {
    for (const leagues of Object.values(MOCK_ACTIVE_LEAGUES)) {
      for (const league of leagues) {
        const m = league.matches.find((m) => m.id === match.id)
        if (m) {
          m.note = note
          m.referee = referee
          m.location = location
          m.startTime = startTime
        }
      }
    }
    setOpen(false)
  }

  const handleReset = () => {
    setNote(match.note ?? '')
    setReferee(match.referee ?? '')
    setLocation(match.location ?? '1')
    setStartTime(match.startTime ?? '2026-03-25T22:48')
  }

  return {
    open,
    setOpen,
    note,
    setNote,
    referee,
    setReferee,
    location,
    setLocation,
    startTime,
    setStartTime,
    handleSave,
    handleReset,
  }
}
