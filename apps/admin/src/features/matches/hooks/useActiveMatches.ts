import { useMemo, useCallback } from 'react'
import { useGetAdminMatchesQuery } from '@/gql/__generated__/graphql'
import { useFilterParams } from '@/hooks/useFilterParams'

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
  hasJudgment: boolean
  judgmentIsAttending: boolean
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

export function useActiveMatches() {
  const { data, loading, error, refetch } = useGetAdminMatchesQuery({ fetchPolicy: 'cache-and-network' })
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['sport', 'compType', 'bracket', 'status'], { status: 'ONGOING' })

  const sportFilter = fp.sport
  const compTypeFilter = fp.compType
  const bracketFilter = fp.bracket
  const statusFilter = fp.status

  const matches: MatchRow[] = useMemo(() => {
    return (data?.matches ?? []).map(m => {
      const entry0 = m.entries[0]
      const entry1 = m.entries[1]
      return {
        id: m.id,
        time: m.time,
        status: m.status,
        statusLabel: toStatusLabel(m.status),
        competitionId: m.competition.id,
        competitionName: m.competition.name,
        competitionType: m.competition.type,
        bracketType: '',
        bracketName: '',
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
        hasJudgment: m.judgment != null && !!(m.judgment.user || m.judgment.team || m.judgment.group || m.judgment.name),
        judgmentIsAttending: m.judgment?.isAttending ?? false,
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

  const bracketOptions = useMemo(() => {
    if (compTypeFilter !== 'TOURNAMENT') return []
    const map = new Map<string, string>()
    for (const m of matches) {
      if (m.competitionType === 'TOURNAMENT' && m.bracketType) {
        if (!map.has(m.bracketType)) {
          map.set(m.bracketType, m.bracketType === 'MAIN' ? 'メインブラケット' : 'サブブラケット')
        }
      }
    }
    return Array.from(map, ([value, label]) => ({ value, label }))
  }, [matches, compTypeFilter])

  const filtered = useMemo(() => {
    let result = matches
    if (sportFilter) result = result.filter(m => m.sportId === sportFilter)
    if (compTypeFilter) result = result.filter(m => m.competitionType === compTypeFilter)
    if (bracketFilter) result = result.filter(m => m.bracketType === bracketFilter)
    if (statusFilter) result = result.filter(m => m.status === statusFilter)
    return result
  }, [matches, sportFilter, compTypeFilter, bracketFilter, statusFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
    if (key === 'compType') {
      setFilter('bracket', '')
    }
  }, [setFilter])

  return {
    matches: filtered,
    allMatches: matches,
    sports,
    sportFilter,
    compTypeFilter,
    bracketFilter,
    statusFilter,
    bracketOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error: error ?? null,
    refetch,
  }
}
