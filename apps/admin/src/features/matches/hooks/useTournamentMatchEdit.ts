import { useState } from 'react'
import { MOCK_TOURNAMENT_DETAILS, persistCompetitionsData } from '@/features/competitions/mock'
import type { MockTMatch } from '@/features/competitions/mock'

export function useTournamentMatchEdit() {
  const [selectedMatch, setSelectedMatch] = useState<MockTMatch | null>(null)
  const [tournamentId, setTournamentId] = useState<string>('')
  const [score1, setScore1] = useState('0')
  const [score2, setScore2] = useState('0')
  const [status, setStatus] = useState<MockTMatch['status']>('STANDBY')

  const openMatch = (match: MockTMatch, tId: string) => {
    setSelectedMatch(match)
    setTournamentId(tId)
    setScore1(match.score1 != null ? String(match.score1) : '0')
    setScore2(match.score2 != null ? String(match.score2) : '0')
    setStatus(match.status)
  }

  const closeMatch = () => setSelectedMatch(null)

  const saveMatch = () => {
    if (!selectedMatch) return
    const detail = MOCK_TOURNAMENT_DETAILS[tournamentId]
    if (!detail) return
    for (const bracket of detail.brackets) {
      const match = bracket.matches.find((m) => m.id === selectedMatch.id)
      if (match) {
        match.score1 = score1 === '' ? null : Number(score1)
        match.score2 = score2 === '' ? null : Number(score2)
        match.status = status
        if (status === 'FINISHED' && match.score1 != null && match.score2 != null) {
          if (match.score1 > match.score2) match.winnerTeamId = match.slot1.teamId
          else if (match.score2 > match.score1) match.winnerTeamId = match.slot2.teamId
          else match.winnerTeamId = null
        }
        break
      }
    }
    persistCompetitionsData()
    closeMatch()
  }

  return { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch }
}
