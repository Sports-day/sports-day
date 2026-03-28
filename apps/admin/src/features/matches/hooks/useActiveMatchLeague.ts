import { MOCK_ACTIVE_LEAGUES } from '../mock'
import type { ActiveLeague, ActiveMatch, ActiveTeam } from '../types'

export type GridCell =
  | { type: 'diagonal' }
  | {
      type: 'match'
      match: ActiveMatch | undefined
      rowTeam: ActiveTeam
      colTeam: ActiveTeam
      homeScore: number
      awayScore: number
    }

export function useActiveMatchLeague(competitionId: string, leagueId: string) {
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []
  const league: ActiveLeague | undefined = leagues.find((l) => l.id === leagueId)

  if (!league) return { league: null, grid: [] as GridCell[][], allFinished: false, loading: false, error: null }

  const allFinished =
    league.matches.length > 0 && league.matches.every((m) => m.status === 'finished')

  const grid: GridCell[][] = league.teams.map((rowTeam) =>
    league.teams.map((colTeam) => {
      if (rowTeam.id === colTeam.id) return { type: 'diagonal' }
      const match = league.matches.find(
        (m) =>
          (m.teamAId === rowTeam.id && m.teamBId === colTeam.id) ||
          (m.teamAId === colTeam.id && m.teamBId === rowTeam.id)
      )
      const isHome = match?.teamAId === rowTeam.id
      return {
        type: 'match',
        match,
        rowTeam,
        colTeam,
        homeScore: match ? (isHome ? (match.scoreA ?? 0) : (match.scoreB ?? 0)) : 0,
        awayScore: match ? (isHome ? (match.scoreB ?? 0) : (match.scoreA ?? 0)) : 0,
      }
    })
  )

  return { league, grid, allFinished, loading: false, error: null }
}
