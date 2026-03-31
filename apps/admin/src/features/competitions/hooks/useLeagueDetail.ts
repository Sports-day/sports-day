import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { MOCK_TEAMS } from '../../teams/mock'
import { MOCK_LEAGUE_DETAILS, MOCK_LEAGUES_BY_COMPETITION, MOCK_TOURNAMENTS_BY_COMPETITION, persistCompetitionsData } from '../mock'
import { syncLeagueName } from '@/lib/autoSync'
import { MOCK_ACTIVE_LEAGUES, persistActiveLeagues } from '@/features/matches/mock'
import type { ActiveMatch, ActiveTeam } from '@/features/matches/types'

type LeagueForm = {
  name: string
  description: string
  weight: string
  matchFormat: string
  resultJudgments: string[]
  tag: string
}

type LeagueEntry = {
  id: number
  teamName: string
  teamClass: string
  teamId?: string
}

export type ProgressionRule = {
  rank: number
  targetId: string
}

export type ProgressionTarget = {
  id: string
  name: string
  type: 'league' | 'tournament'
}

const INITIAL_ENTRIES: LeagueEntry[] = [
  { id: 1, teamName: 'Team A-1', teamClass: 'Class A' },
  { id: 2, teamName: 'Team A-2', teamClass: 'Class A' },
  { id: 3, teamName: 'Team B-1', teamClass: 'Class B' },
]

/**
 * エントリーからラウンドロビンの試合リストを生成し MOCK_ACTIVE_LEAGUES に反映する。
 * 既存の試合結果は、同じ対戦カードが残っていれば保持する。
 */
function syncActiveLeagueMatches(
  competitionId: string,
  leagueId: string,
  leagueName: string,
  entries: LeagueEntry[],
) {
  if (!MOCK_ACTIVE_LEAGUES[competitionId]) {
    MOCK_ACTIVE_LEAGUES[competitionId] = []
  }
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId]
  const league = leagues.find((l) => l.id === leagueId)

  // チーム情報を構築
  const teams: ActiveTeam[] = entries.map((e) => ({
    id: e.teamId ?? `entry_${e.id}`,
    name: e.teamName,
    shortName: e.teamName,
  }))

  // 既存の試合マップ（対戦カードのキーで検索可能にする）
  const existingMatchMap = new Map<string, ActiveMatch>()
  if (league) {
    for (const m of league.matches) {
      const key = [m.teamAId, m.teamBId].sort().join(':')
      existingMatchMap.set(key, m)
    }
  }

  // ラウンドロビン試合を生成
  const matches: ActiveMatch[] = []
  let counter = 0
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const key = [teams[i].id, teams[j].id].sort().join(':')
      const existing = existingMatchMap.get(key)
      if (existing) {
        matches.push(existing)
      } else {
        counter++
        matches.push({
          id: `${leagueId}_m${counter}`,
          teamAId: teams[i].id,
          teamBId: teams[j].id,
          scoreA: 0,
          scoreB: 0,
          status: 'standby',
        })
      }
    }
  }

  if (league) {
    league.name = leagueName
    league.teams = teams
    league.matches = matches
  } else {
    leagues.push({ id: leagueId, name: leagueName, teams, matches })
  }

  persistActiveLeagues()
}

export function useLeagueDetail(leagueId: string, leagueName: string, competitionId: string) {
  const saved = MOCK_LEAGUE_DETAILS[leagueId]
  const [form, setForm] = useState<LeagueForm>({
    name: saved?.name ?? leagueName,
    description: saved?.description ?? '',
    weight: saved?.weight ?? '0',
    matchFormat: saved?.matchFormat ?? 'sunny',
    resultJudgments: saved?.resultJudgments ?? ['score'],
    tag: saved?.tag ?? '',
  })
  const [entries, setEntries] = useState<LeagueEntry[]>(saved?.entries ?? INITIAL_ENTRIES)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [progressionEnabled, setProgressionEnabled] = useState(saved?.progressionEnabled ?? false)
  const [progressionMaxRank, setProgressionMaxRank] = useState(saved?.progressionMaxRank ?? 3)
  const [progressionRules, setProgressionRules] = useState<ProgressionRule[]>(saved?.progressionRules ?? [])

  // 変更のたびに自動保存
  useEffect(() => {
    MOCK_LEAGUE_DETAILS[leagueId] = { ...form, entries, progressionEnabled, progressionMaxRank, progressionRules }
    persistCompetitionsData()
    syncLeagueName(leagueId, form.name)
  }, [form, entries, leagueId, progressionEnabled, progressionMaxRank, progressionRules])

  // エントリー変更時にアクティブリーグの試合データも同期
  useEffect(() => {
    if (entries.length >= 2) {
      syncActiveLeagueMatches(competitionId, leagueId, form.name, entries)
    }
  }, [entries, competitionId, leagueId, form.name])

  const handleChange = (field: keyof Omit<LeagueForm, 'resultJudgments'>) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleScoringChange = (resultJudgments: string[]) => {
    setForm(prev => ({ ...prev, resultJudgments }))
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const handleOpenAddDialog = () => setAddDialogOpen(true)
  const handleCloseAddDialog = () => setAddDialogOpen(false)

  const handleAddEntries = (selectedIds: string[]) => {
    const newEntries = selectedIds.flatMap((id, i) => {
      const team = MOCK_TEAMS.find(t => t.id === id)
      if (!team) return []
      return [{ id: entries.length + i + 1, teamName: team.name, teamClass: team.class, teamId: id }]
    })
    setEntries(prev => [...prev, ...newEntries])
  }

  const handleProgressionRuleChange = (rank: number, targetId: string) => {
    setProgressionRules(prev => {
      const existing = prev.find(r => r.rank === rank)
      if (existing) return prev.map(r => r.rank === rank ? { ...r, targetId } : r)
      return [...prev, { rank, targetId }]
    })
  }

  // 同じcompetitionの他のリーグ・トーナメントを進出先候補として返す
  const availableProgressionTargets: ProgressionTarget[] = [
    ...(MOCK_LEAGUES_BY_COMPETITION[competitionId] ?? [])
      .filter(l => l.id !== leagueId)
      .map(l => ({ id: l.id, name: l.name, type: 'league' as const })),
    ...(MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? [])
      .map(t => ({ id: t.id, name: t.name, type: 'tournament' as const })),
  ]

  return {
    form,
    entries,
    addDialogOpen,
    progressionEnabled,
    progressionMaxRank,
    progressionRules,
    availableProgressionTargets,
    handleChange,
    handleScoringChange,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionMaxRank,
    handleProgressionRuleChange,
    loading: false,
    error: null,
  }
}
