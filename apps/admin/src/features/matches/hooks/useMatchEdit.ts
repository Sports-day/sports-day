import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { MOCK_ACTIVE_LEAGUES } from '../mock'

export type WinnerType = 'teamA' | 'draw' | 'teamB' | null
export type MatchStatusType = 'cancelled' | 'standby' | 'ongoing' | 'finished' | null

export function useMatchEdit() {
  const [selectedMatch, setSelectedMatch] = useState<ActiveMatch | null>(null)
  const [scoreA, setScoreA] = useState<string>('0')
  const [scoreB, setScoreB] = useState<string>('0')
  const [winner, setWinner] = useState<WinnerType>(null)
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>('standby')

  const openMatch = (match: ActiveMatch) => {
    setSelectedMatch(match)
    setScoreA(match.scoreA !== null ? String(match.scoreA) : '0')
    setScoreB(match.scoreB !== null ? String(match.scoreB) : '0')
    setWinner(null)
    setMatchStatus('standby')
  }

  const closeMatch = () => {
    setSelectedMatch(null)
  }

  const resetMatch = () => {
    if (!selectedMatch) return
    setScoreA(selectedMatch.scoreA !== null ? String(selectedMatch.scoreA) : '0')
    setScoreB(selectedMatch.scoreB !== null ? String(selectedMatch.scoreB) : '0')
    setWinner(null)
    setMatchStatus('standby')
  }

  const saveMatch = () => {
    if (!selectedMatch) return
    for (const leagues of Object.values(MOCK_ACTIVE_LEAGUES)) {
      for (const league of leagues) {
        const match = league.matches.find((m) => m.id === selectedMatch.id)
        if (match) {
          match.scoreA = scoreA === '' ? null : Number(scoreA)
          match.scoreB = scoreB === '' ? null : Number(scoreB)
          if (matchStatus) match.status = matchStatus
        }
      }
    }
    closeMatch()
  }

  return {
    selectedMatch,
    scoreA,
    scoreB,
    winner,
    matchStatus,
    setScoreA,
    setScoreB,
    setWinner,
    setMatchStatus,
    openMatch,
    closeMatch,
    resetMatch,
    saveMatch,
  }
}
