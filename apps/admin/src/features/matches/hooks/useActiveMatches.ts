import { useMemo } from 'react'
import { useGetAdminMatchesQuery } from '@/gql/__generated__/graphql'

export type MatchRow = {
  id: string
  time: string
  status: string
  statusLabel: string
  competitionId: string
  competitionName: string
  competitionType: string
  bracketType: string
  bracketName: string
  sportId: string
  sportName: string
  locationId: string
  locationName: string
  teamAId: string
  teamAName: string
  teamBId: string
  teamBName: string
  scoreA: number
  scoreB: number
  winnerTeamId: string
  judgmentName: string
}

type SportOption = { id: string; name: string }

function toStatusLabel(status: string): string {
  switch (status) {
    case 'FINISHED': return '終了'
    case 'ONGOING': return '進行中'
    case 'STANDBY': return 'スタンバイ'
    case 'CANCELED': return '中止'
    default: return status
  }
}

export function useActiveMatches(sportFilter = '') {
  const { data, loading, error, refetch } = useGetAdminMatchesQuery({ fetchPolicy: 'cache-and-network' })

  const matches: MatchRow[] = useMemo(() => {
    // matchId → tournament(bracketType, name) のマッピングを構築
    const bracketMap = new Map<string, { bracketType: string; name: string }>()
    for (const m of data?.matches ?? []) {
      for (const t of m.competition.tournaments ?? []) {
        for (const tm of t.matches) {
          bracketMap.set(tm.id, { bracketType: t.bracketType, name: t.name })
        }
      }
    }

    return (data?.matches ?? []).map(m => {
      const entry0 = m.entries[0]
      const entry1 = m.entries[1]
      const bracket = bracketMap.get(m.id)
      return {
        id: m.id,
        time: m.time,
        status: m.status,
        statusLabel: toStatusLabel(m.status),
        competitionId: m.competition.id,
        competitionName: m.competition.name,
        competitionType: m.competition.type,
        bracketType: bracket?.bracketType ?? '',
        bracketName: bracket?.name ?? '',
        sportId: m.competition.sport.id,
        sportName: m.competition.sport.name,
        locationId: m.location?.id ?? '',
        locationName: m.location?.name ?? '',
        teamAId: entry0?.team?.id ?? '',
        teamAName: entry0?.team?.name ?? '',
        teamBId: entry1?.team?.id ?? '',
        teamBName: entry1?.team?.name ?? '',
        scoreA: entry0?.score ?? 0,
        scoreB: entry1?.score ?? 0,
        winnerTeamId: m.winnerTeam?.id ?? '',
        judgmentName: m.judgment?.name ?? '',
      }
    }).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  }, [data])

  const sports: SportOption[] = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of matches) {
      if (!map.has(m.sportId)) map.set(m.sportId, m.sportName)
    }
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [matches])

  const filtered = useMemo(() => {
    if (!sportFilter) return matches
    return matches.filter(m => m.sportId === sportFilter)
  }, [matches, sportFilter])

  return {
    matches: filtered,
    allMatches: matches,
    sports,
    loading,
    error: error ?? null,
    refetch,
  }
}
