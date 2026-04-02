import { useGetAdminLeagueQuery, useGetAdminLeagueStandingsQuery } from '@/gql/__generated__/graphql'
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

export function useActiveMatchLeague(_competitionId: string, leagueId: string) {
  const { data: leagueData, loading, error } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const { data: standingsData } = useGetAdminLeagueStandingsQuery({
    variables: { leagueId },
    skip: !leagueId,
  })

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

  // 【未確定】 リーグ内の試合一覧は graphQL から取得する方法が未確定（match → league の逆引きが必要）
  const activeMatches: ActiveMatch[] = []

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

  // 【未確定】 試合グリッドは activeMatches が空のため空になる
  const grid: GridCell[][] = activeTeams.map(rowTeam =>
    activeTeams.map(colTeam => {
      if (rowTeam.id === colTeam.id) return { type: 'diagonal' }
      return {
        type: 'match',
        match: undefined,
        rowTeam,
        colTeam,
        homeScore: 0,
        awayScore: 0,
      }
    })
  )

  const allFinished = standings.length > 0 && activeMatches.length === 0
    ? false
    : activeMatches.every(m => m.status === 'finished')

  return { league, grid, allFinished, statsMap, rankLabels, loading, error: error ?? null }
}
