import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '../mock'

export function useMatchDetails(match: ActiveMatch) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(match.note ?? '')
  const [referee, setReferee] = useState(match.referee ?? '')
  const [location, setLocation] = useState(match.location ?? '1')
  const [startTime, setStartTime] = useState(match.startTime ?? new Date().toISOString().slice(0, 16))

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
    persistActiveLeagues()
    setOpen(false)
  }

  const handleReset = () => {
    setNote(match.note ?? '')
    setReferee(match.referee ?? '')
    setLocation(match.location ?? '1')
    setStartTime(match.startTime ?? new Date().toISOString().slice(0, 16))
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
