import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { MOCK_TEAMS } from '../../teams/mock'
import { MOCK_LEAGUE_DETAILS } from '../mock'

type LeagueForm = {
  name: string
  description: string
  weight: string
  matchFormat: string
  resultJudgment: string
  tag: string
}

type LeagueEntry = {
  id: number
  teamName: string
  teamClass: string
}

const INITIAL_ENTRIES: LeagueEntry[] = [
  { id: 1, teamName: 'Team A-1', teamClass: 'Class A' },
  { id: 2, teamName: 'Team A-2', teamClass: 'Class A' },
  { id: 3, teamName: 'Team B-1', teamClass: 'Class B' },
]

export function useLeagueDetail(leagueId: string, leagueName: string) {
  const saved = MOCK_LEAGUE_DETAILS[leagueId]
  const [form, setForm] = useState<LeagueForm>({
    name: saved?.name ?? leagueName,
    description: saved?.description ?? '',
    weight: saved?.weight ?? '0',
    matchFormat: saved?.matchFormat ?? 'sunny',
    resultJudgment: saved?.resultJudgment ?? 'score',
    tag: saved?.tag ?? '',
  })
  const [entries, setEntries] = useState<LeagueEntry[]>(saved?.entries ?? INITIAL_ENTRIES)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // 変更のたびに自動保存
  useEffect(() => {
    MOCK_LEAGUE_DETAILS[leagueId] = { ...form, entries }
  }, [form, entries, leagueId])

  const handleChange = (field: keyof LeagueForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
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

  return {
    form,
    entries,
    addDialogOpen,
    handleChange,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    loading: false,
    error: null,
  }
}
