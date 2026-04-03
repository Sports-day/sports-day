import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminLeagueQuery,
  useGetAdminTeamsQuery,
  useGetAdminCompetitionsQuery,
  useGetAdminPromotionRulesQuery,
  useUpdateAdminLeagueRuleMutation,
  useCreateAdminPromotionRuleMutation,
  useDeleteAdminPromotionRuleMutation,
  GetAdminPromotionRulesDocument,
  CompetitionType,
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

export function useLeagueDetail(leagueId: string, leagueName: string, competitionId: string) {
  const { data: leagueData, loading, error } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const { data: teamsData } = useGetAdminTeamsQuery()
  const { data: competitionsData } = useGetAdminCompetitionsQuery()
  const { data: promotionRulesData } = useGetAdminPromotionRulesQuery({
    variables: { sourceCompetitionId: competitionId },
    skip: !competitionId,
  })

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
  const [progressionEnabled, setProgressionEnabled] = useState(false)
  const [progressionMaxRank, setProgressionMaxRank] = useState(3)
  const [progressionRules, setProgressionRules] = useState<ProgressionRule[]>([])
  // GQL PromotionRule.id を rank でひけるようにする
  const [ruleIdByRank, setRuleIdByRank] = useState<Record<number, string>>({})

  const [updateLeagueRule] = useUpdateAdminLeagueRuleMutation()
  const [createPromotionRule] = useCreateAdminPromotionRuleMutation({
    refetchQueries: [{ query: GetAdminPromotionRulesDocument, variables: { sourceCompetitionId: competitionId } }],
  })
  const [deletePromotionRule] = useDeleteAdminPromotionRuleMutation({
    refetchQueries: [{ query: GetAdminPromotionRulesDocument, variables: { sourceCompetitionId: competitionId } }],
  })

  // GQL データで初期化
  useEffect(() => {
    if (league?.name !== undefined) {
      setForm(prev => ({ ...prev, name: league.name }))
    }
  }, [league?.name])

  useEffect(() => {
    if (league?.teams !== undefined) {
      setEntries(league.teams.map((t, i) => ({
        id: i + 1,
        teamName: t.name,
        teamClass: t.group.name,
        teamId: t.id,
      })))
    }
  }, [league?.teams])

  useEffect(() => {
    if (promotionRulesData?.promotionRules) {
      const rules = promotionRulesData.promotionRules
      setProgressionRules(rules.map(r => ({
        rank: parseInt(r.rankSpec),
        targetId: r.targetCompetition.id,
      })))
      setProgressionEnabled(rules.length > 0)
      const idMap: Record<number, string> = {}
      for (const r of rules) {
        idMap[parseInt(r.rankSpec)] = r.id
      }
      setRuleIdByRank(idMap)
    }
  }, [promotionRulesData?.promotionRules])

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

  const handleProgressionRuleChange = async (rank: number, targetId: string) => {
    // 既存ルールがあれば削除してから再作成
    const existingId = ruleIdByRank[rank]
    if (existingId) {
      await deletePromotionRule({ variables: { id: existingId } }).catch(() => {})
    }
    if (targetId) {
      await createPromotionRule({
        variables: {
          input: {
            sourceCompetitionId: competitionId,
            targetCompetitionId: targetId,
            rankSpec: String(rank),
          },
        },
      }).catch(() => {})
    }
    // ローカル state も即時更新
    setProgressionRules(prev => {
      const existing = prev.find(r => r.rank === rank)
      if (existing) return prev.map(r => r.rank === rank ? { ...r, targetId } : r)
      return [...prev, { rank, targetId }]
    })
  }

  // 同一 competitionId の他リーグ・トーナメントを候補として提示
  const availableProgressionTargets: ProgressionTarget[] = (competitionsData?.competitions ?? [])
    .filter(c => c.id !== competitionId)
    .map(c => ({
      id: c.id,
      name: c.name,
      type: c.type === CompetitionType.League ? 'league' : 'tournament',
    }))

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
