import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminLeagueQuery,
  useGetAdminTeamsQuery,
  useUpdateAdminLeagueRuleMutation,
} from '@/gql/__generated__/graphql'

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

export function useLeagueDetail(leagueId: string, leagueName: string, _competitionId: string) {
  const { data: leagueData, loading, error } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const { data: teamsData } = useGetAdminTeamsQuery()

  const league = leagueData?.league

  const [form, setForm] = useState<LeagueForm>({
    name: league?.name ?? leagueName,
    description: '',
    weight: '0',
    matchFormat: 'sunny',
    resultJudgments: ['score'],
    tag: '',
  })

  // GraphQL のリーグチームをエントリーとして使用
  const [entries, setEntries] = useState<LeagueEntry[]>(
    (league?.teams ?? []).map((t, i) => ({
      id: i + 1,
      teamName: t.name,
      teamClass: t.group.name,
      teamId: t.id,
    }))
  )

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  // 【未確定】 progression rules は GraphQL PromotionRule へ移行が必要
  const [progressionEnabled, setProgressionEnabled] = useState(false)
  const [progressionMaxRank, setProgressionMaxRank] = useState(3)
  const [progressionRules, setProgressionRules] = useState<ProgressionRule[]>([])

  const [updateLeagueRule] = useUpdateAdminLeagueRuleMutation()

  const handleChange = (field: keyof Omit<LeagueForm, 'resultJudgments'>) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleScoringChange = (resultJudgments: string[]) => {
    setForm(prev => ({ ...prev, resultJudgments }))
    // 【未確定】 UpdateLeagueRuleInput は win/draw/lose ポイントのみ対応
    updateLeagueRule({
      variables: { id: leagueId, input: {} },
    }).catch(() => {})
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const handleOpenAddDialog = () => setAddDialogOpen(true)
  const handleCloseAddDialog = () => setAddDialogOpen(false)

  const handleAddEntries = (selectedIds: string[]) => {
    const allTeams = teamsData?.teams ?? []
    const newEntries = selectedIds.flatMap((id, i) => {
      const team = allTeams.find(t => t.id === id)
      if (!team) return []
      return [{
        id: entries.length + i + 1,
        teamName: team.name,
        teamClass: team.group.name,
        teamId: id,
      }]
    })
    setEntries(prev => [...prev, ...newEntries])
    setAddDialogOpen(false)
  }

  const handleProgressionRuleChange = (rank: number, targetId: string) => {
    setProgressionRules(prev => {
      const existing = prev.find(r => r.rank === rank)
      if (existing) return prev.map(r => r.rank === rank ? { ...r, targetId } : r)
      return [...prev, { rank, targetId }]
    })
  }

  // 【未確定】 同一 competition の他リーグ・トーナメントは後続タスクで対応
  const availableProgressionTargets: ProgressionTarget[] = []

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
    loading,
    error: error ?? null,
  }
}
