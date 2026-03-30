import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { MOCK_TEAMS } from '../../teams/mock'
import { MOCK_LEAGUE_DETAILS, MOCK_LEAGUES_BY_COMPETITION, MOCK_TOURNAMENTS_BY_COMPETITION, persistCompetitionsData } from '../mock'

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
  }, [form, entries, leagueId, progressionEnabled, progressionMaxRank, progressionRules])

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
      return [{ id: entries.length + i + 1, teamName: team.name, teamClass: team.class }]
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
