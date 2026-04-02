import { useState } from 'react'
import { useUpdateAdminMatchResultMutation, MatchStatus } from '@/gql/__generated__/graphql'
import type { MockTMatch } from '@/features/competitions/types'

export function useTournamentMatchEdit() {
  const [selectedMatch, setSelectedMatch] = useState<MockTMatch | null>(null)
  const [score1, setScore1] = useState('0')
  const [score2, setScore2] = useState('0')
  const [status, setStatus] = useState<MockTMatch['status']>('STANDBY')

  const [updateMatchResult] = useUpdateAdminMatchResultMutation()

  const openMatch = (match: MockTMatch, _tId: string) => {
    setSelectedMatch(match)
    setScore1(match.score1 != null ? String(match.score1) : '0')
    setScore2(match.score2 != null ? String(match.score2) : '0')
    setStatus(match.status)
  }

  const closeMatch = () => setSelectedMatch(null)

  const saveMatch = () => {
    if (!selectedMatch) return

    const s1 = score1 === '' ? 0 : Number(score1)
    const s2 = score2 === '' ? 0 : Number(score2)

    const gqlStatus =
      status === 'FINISHED' ? MatchStatus.Finished :
      status === 'ONGOING' ? MatchStatus.Ongoing :
      MatchStatus.Standby

    const winnerTeamId =
      status === 'FINISHED' && s1 !== s2
        ? s1 > s2
          ? (selectedMatch.slot1.teamId ?? null)
          : (selectedMatch.slot2.teamId ?? null)
        : null

    updateMatchResult({
      variables: {
        id: selectedMatch.id,
        input: {
          status: gqlStatus,
          winnerTeamId,
          results: [
            ...(selectedMatch.slot1.teamId ? [{ teamId: selectedMatch.slot1.teamId, score: s1 }] : []),
            ...(selectedMatch.slot2.teamId ? [{ teamId: selectedMatch.slot2.teamId, score: s2 }] : []),
          ],
        },
      },
      refetchQueries: ['GetAdminTournament'],
    }).then(() => closeMatch()).catch(() => {})
  }

  return { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch }
}
