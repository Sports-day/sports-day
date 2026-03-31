import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '../mock'

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
    setMatchStatus(match.status ?? 'standby')
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
          // winner フィールドがある場合は保存（明示的な勝敗指定）
          if (winner === 'teamA') match.winner = 'teamA'
          else if (winner === 'teamB') match.winner = 'teamB'
          else if (winner === 'draw') match.winner = 'draw'
          else match.winner = undefined
        }
      }
    }
    persistActiveLeagues()
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
