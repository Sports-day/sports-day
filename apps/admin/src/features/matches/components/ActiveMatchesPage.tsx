import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { navigateToPage } from '@/hooks/useAppNavigation'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'
import { QueryError } from '@/components/ui/QueryError'
import { useActiveMatches } from '../hooks/useActiveMatches'
import type { MatchRow } from '../hooks/useActiveMatches'
import { MatchCard } from './MatchCard'
import { useMatchEdit } from '../hooks/useMatchEdit'
import type { ActiveMatch, ActiveTeam } from '../types'
import { MatchEditPage } from './MatchEditPage'
import { CARD_GRADIENT } from '@/styles/commonSx'
import { useResetToList } from '@/hooks/useResetToList'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'

function toActiveMatch(row: MatchRow): ActiveMatch {
  return {
    id: row.id,
    teamAId: row.teamAId,
    teamBId: row.teamBId,
    scoreA: row.scoreA,
    scoreB: row.scoreB,
    status: row.status === 'FINISHED' ? 'finished'
      : row.status === 'ONGOING' ? 'ongoing'
      : row.status === 'CANCELED' ? 'cancelled'
      : 'standby',
    winner: row.winnerTeamId === row.teamAId ? 'teamA'
      : row.winnerTeamId === row.teamBId ? 'teamB'
      : undefined,
    time: row.time,
    locationId: row.locationId || undefined,
    judgmentName: row.judgmentName,
  }
}

function toActiveTeam(id: string, name: string): ActiveTeam {
  return { id, name, shortName: name }
}

const STATUS_OPTIONS = [
  { value: 'STANDBY', label: 'スタンバイ' },
  { value: 'ONGOING', label: '進行中' },
  { value: 'FINISHED', label: '終了' },
  { value: 'CANCELED', label: '中止' },
]

const COMPETITION_TYPE_OPTIONS = [
  { value: 'LEAGUE', label: 'リーグ' },
  { value: 'TOURNAMENT', label: 'トーナメント' },
]

type View =
  | { type: 'list' }
  | { type: 'edit'; row: MatchRow }
  | { type: 'pending-deeplink'; matchId: string }

export function ActiveMatchesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const matchIdParam = searchParams.get('matchId')
  const fromParam = searchParams.get('from')
  const fromCompetitionId = searchParams.get('competitionId')
  const fromCompetitionName = searchParams.get('competitionName')

  const [view, setView] = useState<View>(
    matchIdParam ? { type: 'pending-deeplink', matchId: matchIdParam } : { type: 'list' },
  )

  // 大会詳細から遷移してきた場合の戻り先情報（初回マウント時のURLパラメータから一度だけ初期化）
  const [competitionReturn] = useState<{
    competitionId: string
    competitionName: string
    type: 'LEAGUE' | 'TOURNAMENT'
  } | null>(
    (fromParam === 'tournament' || fromParam === 'league') && fromCompetitionId && fromCompetitionName
      ? { competitionId: fromCompetitionId, competitionName: fromCompetitionName, type: fromParam === 'tournament' ? 'TOURNAMENT' : 'LEAGUE' }
      : null,
  )

  // searchParams の matchId が変わったら pending-deeplink に遷移
  const prevMatchIdRef = useRef(matchIdParam)
  useEffect(() => {
    if (matchIdParam && matchIdParam !== prevMatchIdRef.current) {
      setView({ type: 'pending-deeplink', matchId: matchIdParam })
    }
    prevMatchIdRef.current = matchIdParam
  }, [matchIdParam])

  useResetToList(view.type === 'list', useCallback(() => setView({ type: 'list' }), []))

  const {
    matches: filteredMatches,
    allMatches: matches,
    sports,
    sportFilter,
    compTypeFilter,
    bracketFilter,
    statusFilter,
    bracketOptions,
    handleFilterChange,
    resetFilters,
    loading,
    error,
    refetch,
  } = useActiveMatches()

  const matchEdit = useMatchEdit()

  // matchId クエリパラメータによるディープリンク（allMatchesからも検索）
  useEffect(() => {
    if (view.type !== 'pending-deeplink' || loading || matches.length === 0) return
    const row = matches.find(m => m.id === view.matchId)
    if (row) {
      matchEdit.openMatch(toActiveMatch(row))
      setView({ type: 'edit', row })
    } else {
      setView({ type: 'list' })
    }
    // from/competitionId/competitionName は competitionReturn に保存済みのでまとめてクリア
    setSearchParams({}, { replace: true })
  }, [view, matches, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const filterDefs: FilterDef[] = useMemo(() => {
    const defs: FilterDef[] = [
      {
        key: 'sport',
        label: '競技',
        options: sports.map(s => ({ value: s.id, label: s.name })),
      },
      {
        key: 'compType',
        label: '大会形式',
        options: COMPETITION_TYPE_OPTIONS,
      },
    ]
    if (compTypeFilter === 'TOURNAMENT' && bracketOptions.length > 0) {
      defs.push({
        key: 'bracket',
        label: 'ブラケット',
        options: bracketOptions,
      })
    }
    defs.push({
      key: 'status',
      label: 'ステータス',
      options: STATUS_OPTIONS,
    })
    return defs
  }, [sports, compTypeFilter, bracketOptions])

  const filterValues = useMemo(() => ({
    sport: sportFilter,
    compType: compTypeFilter,
    bracket: bracketFilter,
    status: statusFilter,
  }), [sportFilter, compTypeFilter, bracketFilter, statusFilter])

  const handleCardClick = (row: MatchRow) => {
    matchEdit.openMatch(toActiveMatch(row))
    setView({ type: 'edit', row })
  }

  if (view.type === 'pending-deeplink') {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={28} /></Box>
  }

  if (view.type === 'edit' && matchEdit.selectedMatch) {
    const { row } = view
    return (
      <MatchEditPage
        match={matchEdit.selectedMatch}
        teamA={toActiveTeam(row.teamAId, row.teamAName)}
        teamB={toActiveTeam(row.teamBId, row.teamBName)}
        context={{
          leagueId: row.competitionId,
          leagueName: row.competitionName,
          competitionName: row.sportName,
          competitionType: row.competitionType,
        }}
        form={{
          scoreA: matchEdit.scoreA,
          scoreB: matchEdit.scoreB,
          winner: matchEdit.winner,
          matchStatus: matchEdit.matchStatus,
          onScoreAChange: matchEdit.setScoreA,
          onScoreBChange: matchEdit.setScoreB,
          onWinnerChange: matchEdit.setWinner,
          onMatchStatusChange: matchEdit.setMatchStatus,
        }}
        nav={{
          onBack: competitionReturn
            ? () => navigateToPage('competitions', {
                competitionId: competitionReturn.competitionId,
                competitionName: competitionReturn.competitionName,
                type: competitionReturn.type,
              })
            : () => { matchEdit.closeMatch(); setView({ type: 'list' }) },
          onBackToList: () => { matchEdit.closeMatch(); setView({ type: 'list' }) },
          onBackToCompetition: competitionReturn
            ? () => navigateToPage('competitions', {
                competitionId: competitionReturn.competitionId,
                competitionName: competitionReturn.competitionName,
                type: competitionReturn.type,
              })
            : () => { matchEdit.closeMatch(); setView({ type: 'list' }) },
        }}
        dirty={matchEdit.dirty}
        onReset={matchEdit.resetMatch}
        onSave={async () => {
          try {
            await matchEdit.saveMatch()
            refetch()
          } catch {
            // エラートーストはhook側で表示済み
          }
        }}
      />
    )
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        試合
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          filters={filterDefs}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          resultCount={filteredMatches.length}
          onReset={resetFilters}
        />
      </Box>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべての試合
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#666', ml: 'auto' }}>
              {filteredMatches.length}件
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : error ? (
            <QueryError onRetry={refetch} />
          ) : filteredMatches.length === 0 ? (
            <Typography sx={{ fontSize: '13px', color: '#888', py: 6, textAlign: 'center' }}>
              {sportFilter || compTypeFilter || bracketFilter || statusFilter ? '条件に一致する試合がありません' : '試合がありません'}
            </Typography>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 1.5,
            }}>
              {filteredMatches.map((row) => (
                <MatchCard
                  key={row.id}
                  match={row}
                  onClick={() => handleCardClick(row)}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
