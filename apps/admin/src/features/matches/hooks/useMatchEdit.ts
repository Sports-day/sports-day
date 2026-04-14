import { useState } from 'react'
import type { ActiveMatch } from '../types'
import { useUpdateAdminMatchResultMutation, MatchStatus } from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

export type WinnerType = 'teamA' | 'draw' | 'teamB' | null
export type MatchStatusType = 'cancelled' | 'standby' | 'ongoing' | 'finished' | null

const STATUS_MAP: Record<NonNullable<MatchStatusType>, MatchStatus> = {
  cancelled: MatchStatus.Canceled,
  standby: MatchStatus.Standby,
  ongoing: MatchStatus.Ongoing,
  finished: MatchStatus.Finished,
}

function computeWinner(a: string, b: string): WinnerType {
  const numA = parseInt(a, 10)
  const numB = parseInt(b, 10)
  if (a === '' || b === '' || !Number.isFinite(numA) || !Number.isFinite(numB)) return null
  if (numA > numB) return 'teamA'
  if (numB > numA) return 'teamB'
  return 'draw'
}

export function useMatchEdit() {
  const [selectedMatch, setSelectedMatch] = useState<ActiveMatch | null>(null)
  const [scoreA, setScoreA] = useState<string>('0')
  const [scoreB, setScoreB] = useState<string>('0')
  const [winner, setWinner] = useState<WinnerType>(null)
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>('standby')
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [updateMatchResult] = useUpdateAdminMatchResultMutation()

  const handleSetScoreA = (v: string) => {
    setScoreA(v)
    setWinner(computeWinner(v, scoreB))
  }

  const handleSetScoreB = (v: string) => {
    setScoreB(v)
    setWinner(computeWinner(scoreA, v))
  }

  // 初期値を保持して dirty 検知に使う
  const [saved, setSaved] = useState<{ scoreA: string; scoreB: string; winner: WinnerType; matchStatus: MatchStatusType }>({
    scoreA: '0', scoreB: '0', winner: null, matchStatus: 'standby',
  })

  const dirty =
    scoreA !== saved.scoreA ||
    scoreB !== saved.scoreB ||
    winner !== saved.winner ||
    matchStatus !== saved.matchStatus

  const openMatch = (match: ActiveMatch) => {
    const a = match.scoreA !== null ? String(match.scoreA) : '0'
    const b = match.scoreB !== null ? String(match.scoreB) : '0'
    const w = match.winner ?? computeWinner(a, b)
    const s = match.status ?? 'standby'
    setSelectedMatch(match)
    setScoreA(a)
    setScoreB(b)
    setWinner(w)
    setMatchStatus(s)
    setSaved({ scoreA: a, scoreB: b, winner: w, matchStatus: s })
  }

  const closeMatch = () => setSelectedMatch(null)

  const resetMatch = () => {
    if (!selectedMatch) return
    setScoreA(selectedMatch.scoreA !== null ? String(selectedMatch.scoreA) : '0')
    setScoreB(selectedMatch.scoreB !== null ? String(selectedMatch.scoreB) : '0')
    setWinner(null)
    setMatchStatus('standby')
  }

  const saveMatch = async () => {
    if (!selectedMatch) return

    const parsedA = Number(scoreA)
    const parsedB = Number(scoreB)
    const scoreAVal = scoreA === '' ? 0 : (Number.isFinite(parsedA) && parsedA >= 0 && Number.isInteger(parsedA) ? parsedA : 0)
    const scoreBVal = scoreB === '' ? 0 : (Number.isFinite(parsedB) && parsedB >= 0 && Number.isInteger(parsedB) ? parsedB : 0)

    // winner からチーム ID を解決
    const winnerTeamId =
      winner === 'teamA' ? selectedMatch.teamAId :
      winner === 'teamB' ? selectedMatch.teamBId :
      null

    try {
      await updateMatchResult({
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
        refetchQueries: ['GetAdminCompetitionMatches', 'GetAdminMatches'],
      })
      setMutationError(null)
      setSaved({ scoreA, scoreB, winner, matchStatus })
      closeMatch()
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showApiErrorToast(e)
      throw e
    }
  }

  return {
    selectedMatch,
    scoreA,
    scoreB,
    winner,
    matchStatus,
    dirty,
    setScoreA: handleSetScoreA,
    setScoreB: handleSetScoreB,
    setWinner,
    setMatchStatus,
    openMatch,
    closeMatch,
    resetMatch,
    saveMatch,
    error: mutationError,
  }
}
