import { useGetAdminLeagueQuery, useGetAdminLeagueStandingsQuery, useGetAdminMatchesQuery } from '@/gql/__generated__/graphql'
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

export function statusLabel(status: ActiveMatch['status']): string {
  if (status === 'finished') return '終了'
  if (status === 'ongoing') return '進行中'
  return '未登録'
}

function toActiveStatus(s: string): ActiveMatch['status'] {
  if (s === 'ONGOING') return 'ongoing'
  if (s === 'FINISHED') return 'finished'
  if (s === 'CANCELED') return 'cancelled'
  return 'standby'
}

export function useActiveMatchLeague(competitionId: string, leagueId: string) {
  const { data: leagueData, loading, error } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const { data: standingsData } = useGetAdminLeagueStandingsQuery({
    variables: { leagueId },
    skip: !leagueId,
  })
  const { data: matchesData } = useGetAdminMatchesQuery()

  if (!leagueData?.league) {
    return {
      league: null,
      grid: [] as GridCell[][],
      allFinished: false,
      statsMap: new Map<string, TeamStats>(),
      rankLabels: new Map<string, string>(),
      loading,
      error: error ?? null,
    }
  }

  const gqlLeague = leagueData.league
  const standings = standingsData?.leagueStandings ?? []

  // GraphQL League.teams → ActiveTeam
  const activeTeams: ActiveTeam[] = gqlLeague.teams.map(t => ({
    id: t.id,
    name: t.name,
    shortName: t.name,
  }))

  // competition.matches から league 内の試合を取得（competition.id で絞り込み）
  const activeMatches: ActiveMatch[] = (matchesData?.matches ?? [])
    .filter(m => m.competition.id === competitionId)
    .map(m => {
      const entry0 = m.entries[0]
      const entry1 = m.entries[1]
      const winnerTeamId = m.winnerTeam?.id ?? null
      let winner: ActiveMatch['winner']
      if (winnerTeamId && entry0?.team?.id === winnerTeamId) winner = 'teamA'
      else if (winnerTeamId && entry1?.team?.id === winnerTeamId) winner = 'teamB'
      return {
        id: m.id,
        teamAId: entry0?.team?.id ?? '',
        teamBId: entry1?.team?.id ?? '',
        scoreA: entry0?.score ?? null,
        scoreB: entry1?.score ?? null,
        status: toActiveStatus(m.status),
        winner,
        time: m.time,
        location: m.location?.name,
      }
    })

  const league: ActiveLeague = {
    id: gqlLeague.id,
    name: gqlLeague.name,
    teams: activeTeams,
    matches: activeMatches,
  }

  // leagueStandings から statsMap を構築
  const statsMap = new Map<string, TeamStats>()
  for (const standing of standings) {
    statsMap.set(standing.team.id, {
      points: standing.points,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      matchesPlayed: standing.win + standing.draw + standing.lose,
      winRate: standing.win + standing.draw + standing.lose > 0
        ? standing.points / ((standing.win + standing.draw + standing.lose) * 3)
        : 0,
      totalGoalRate: standing.win + standing.draw + standing.lose > 0
        ? standing.goalsFor / (standing.win + standing.draw + standing.lose)
        : 0,
    })
  }

  // rankLabels は standings の rank から生成
  const rankLabels = new Map<string, string>()
  for (const standing of standings) {
    rankLabels.set(standing.team.id, `${standing.rank}位`)
  }

  const grid: GridCell[][] = activeTeams.map(rowTeam =>
    activeTeams.map(colTeam => {
      if (rowTeam.id === colTeam.id) return { type: 'diagonal' }
      const match = activeMatches.find(m =>
        (m.teamAId === rowTeam.id && m.teamBId === colTeam.id) ||
        (m.teamAId === colTeam.id && m.teamBId === rowTeam.id)
      )
      const homeScore = match?.teamAId === rowTeam.id ? (match?.scoreA ?? 0) : (match?.scoreB ?? 0)
      const awayScore = match?.teamBId === colTeam.id ? (match?.scoreB ?? 0) : (match?.scoreA ?? 0)
      return {
        type: 'match',
        match,
        rowTeam,
        colTeam,
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
      }
    })
  )

  const allFinished = activeMatches.length > 0 && activeMatches.every(m => m.status === 'finished')

  return { league, grid, allFinished, statsMap, rankLabels, loading, error: error ?? null }
}
