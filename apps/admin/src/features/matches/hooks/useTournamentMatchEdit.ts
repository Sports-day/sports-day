import { useState } from 'react'
import { MOCK_TOURNAMENT_DETAILS, persistCompetitionsData } from '@/features/competitions/mock'
import type { MockTMatch } from '@/features/competitions/mock'

/**
 * 試合結果を保存した後、勝者／敗者チーム情報を後続の試合スロットに伝播する。
 * MATCH_WINNER スロット → 勝者チーム、MATCH_LOSER スロット → 敗者チーム
 */
function propagateResults(tournamentId: string) {
  const detail = MOCK_TOURNAMENT_DETAILS[tournamentId]
  if (!detail) return

  // すべてのブラケットの全試合をマップに集める
  const matchMap = new Map<string, MockTMatch>()
  for (const bracket of detail.brackets) {
    for (const m of bracket.matches) {
      matchMap.set(m.id, m)
    }
  }

  // 全スロットを走査して、ソース試合から勝者/敗者を伝播
  for (const bracket of detail.brackets) {
    for (const match of bracket.matches) {
      for (const slot of [match.slot1, match.slot2]) {
        if (!slot.sourceMatchId) continue
        const source = matchMap.get(slot.sourceMatchId)
        if (!source || source.status !== 'FINISHED' || !source.winnerTeamId) {
          // ソース試合が未終了 → スロットをクリア
          if (slot.sourceType === 'MATCH_WINNER' || slot.sourceType === 'MATCH_LOSER') {
            slot.teamId = null
            slot.teamName = null
          }
          continue
        }

        const winnerId = source.winnerTeamId
        const loserId = source.slot1.teamId === winnerId ? source.slot2.teamId : source.slot1.teamId
        const winnerName = source.slot1.teamId === winnerId ? source.slot1.teamName : source.slot2.teamName
        const loserName = source.slot1.teamId === winnerId ? source.slot2.teamName : source.slot1.teamName

        if (slot.sourceType === 'MATCH_WINNER') {
          slot.teamId = winnerId
          slot.teamName = winnerName ?? null
        } else if (slot.sourceType === 'MATCH_LOSER') {
          slot.teamId = loserId ?? null
          slot.teamName = loserName ?? null
        }
      }
    }
  }
}

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
        } else if (status !== 'FINISHED') {
          match.winnerTeamId = null
        }
        break
      }
    }
    // 勝者/敗者をトーナメント全体に伝播
    propagateResults(tournamentId)
    persistCompetitionsData()
    closeMatch()
  }

  return { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch }
}
