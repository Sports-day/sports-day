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

export type TeamStats = {
  points: number
  goalsFor: number
  goalsAgainst: number
  matchesPlayed: number
  winRate: number
  totalGoalRate: number
}

function calcStats(team: ActiveTeam, matches: ActiveMatch[]): TeamStats {
  let wins = 0, draws = 0, goalsFor = 0, goalsAgainst = 0, matchesPlayed = 0
  matches.forEach((m) => {
    const isHome = m.teamAId === team.id
    const isAway = m.teamBId === team.id
    if (!isHome && !isAway) return
    if (m.status !== 'finished') return
    matchesPlayed++
    const myScore = isHome ? (m.scoreA ?? 0) : (m.scoreB ?? 0)
    const oppScore = isHome ? (m.scoreB ?? 0) : (m.scoreA ?? 0)
    goalsFor += myScore
    goalsAgainst += oppScore
    if (myScore > oppScore) wins++
    else if (myScore === oppScore) draws++
  })
  const points = wins * 3 + draws
  return {
    points,
    goalsFor,
    goalsAgainst,
    matchesPlayed,
    winRate: matchesPlayed > 0 ? points / (matchesPlayed * 3) : 0,
    totalGoalRate: matchesPlayed > 0 ? goalsFor / matchesPlayed : 0,
  }
}

function calcRankLabel(team: ActiveTeam, allTeams: ActiveTeam[], statsMap: Map<string, TeamStats>): string {
  const my = statsMap.get(team.id)!
  const myDiff = my.goalsFor - my.goalsAgainst
  let better = 0, tied = 0
  allTeams.forEach((t) => {
    if (t.id === team.id) return
    const s = statsMap.get(t.id)!
    const sDiff = s.goalsFor - s.goalsAgainst
    if (s.points > my.points || (s.points === my.points && sDiff > myDiff) || (s.points === my.points && sDiff === myDiff && s.goalsFor > my.goalsFor)) {
      better++
    } else if (s.points === my.points && sDiff === myDiff && s.goalsFor === my.goalsFor) {
      tied++
    }
  })
  const rank = better + 1
  return tied > 0 ? `同率${rank}位` : `${rank}位`
}

export function statusLabel(status: ActiveMatch['status']): string {
  if (status === 'finished') return '終了'
  if (status === 'ongoing') return '進行中'
  return '未登録'
}

export function useActiveMatchLeague(competitionId: string, leagueId: string) {
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []
  const league: ActiveLeague | undefined = leagues.find((l) => l.id === leagueId)

  if (!league) return {
    league: null,
    grid: [] as GridCell[][],
    allFinished: false,
    statsMap: new Map<string, TeamStats>(),
    rankLabels: new Map<string, string>(),
    loading: false,
    error: null,
  }

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

  const statsMap = new Map(league.teams.map((t) => [t.id, calcStats(t, league.matches)]))
  const rankLabels = new Map(league.teams.map((t) => [t.id, calcRankLabel(t, league.teams, statsMap)]))

  return { league, grid, allFinished, statsMap, rankLabels, loading: false, error: null }
}
