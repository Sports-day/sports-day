import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { useUpdateAdminMatchResultMutation, MatchStatus } from '@/gql/__generated__/graphql'

export type WinnerType = 'teamA' | 'draw' | 'teamB' | null
export type MatchStatusType = 'cancelled' | 'standby' | 'ongoing' | 'finished' | null

const STATUS_MAP: Record<NonNullable<MatchStatusType>, MatchStatus> = {
  cancelled: MatchStatus.Canceled,
  standby: MatchStatus.Standby,
  ongoing: MatchStatus.Ongoing,
  finished: MatchStatus.Finished,
}

export function useMatchEdit() {
  const [selectedMatch, setSelectedMatch] = useState<ActiveMatch | null>(null)
  const [scoreA, setScoreA] = useState<string>('0')
  const [scoreB, setScoreB] = useState<string>('0')
  const [winner, setWinner] = useState<WinnerType>(null)
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>('standby')

  const [updateMatchResult] = useUpdateAdminMatchResultMutation()

  const openMatch = (match: ActiveMatch) => {
    setSelectedMatch(match)
    setScoreA(match.scoreA !== null ? String(match.scoreA) : '0')
    setScoreB(match.scoreB !== null ? String(match.scoreB) : '0')
    setWinner(null)
    setMatchStatus(match.status ?? 'standby')
  }

  const closeMatch = () => setSelectedMatch(null)

  const resetMatch = () => {
    if (!selectedMatch) return
    setScoreA(selectedMatch.scoreA !== null ? String(selectedMatch.scoreA) : '0')
    setScoreB(selectedMatch.scoreB !== null ? String(selectedMatch.scoreB) : '0')
    setWinner(null)
    setMatchStatus('standby')
  }

  const saveMatch = () => {
    if (!selectedMatch) return

    const parsedA = Number(scoreA)
    const parsedB = Number(scoreB)
    const scoreAVal = scoreA === '' ? 0 : (Number.isFinite(parsedA) && parsedA >= 0 ? parsedA : 0)
    const scoreBVal = scoreB === '' ? 0 : (Number.isFinite(parsedB) && parsedB >= 0 ? parsedB : 0)

    // winner からチーム ID を解決
    const winnerTeamId =
      winner === 'teamA' ? selectedMatch.teamAId :
      winner === 'teamB' ? selectedMatch.teamBId :
      null

    updateMatchResult({
      variables: {
        id: selectedMatch.id,
        input: {
          status: matchStatus ? STATUS_MAP[matchStatus] : undefined,
          winnerTeamId,
          results: [
            { teamId: selectedMatch.teamAId, score: scoreAVal },
            { teamId: selectedMatch.teamBId, score: scoreBVal },
          ],
        },
      },
      refetchQueries: ['GetAdminMatches'],
    }).then(() => closeMatch()).catch(() => {})
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
