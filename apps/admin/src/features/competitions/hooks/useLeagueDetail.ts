import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminLeagueQuery,
  useGetAdminCompetitionsQuery,
  useGetAdminCompetitionQuery,
  useGetAdminPromotionRulesQuery,
  useUpdateAdminLeagueRuleMutation,
  useCreateAdminPromotionRuleMutation,
  useDeleteAdminPromotionRuleMutation,
  useAddAdminCompetitionEntriesMutation,
  useDeleteAdminCompetitionEntriesMutation,
  GetAdminPromotionRulesDocument,
  GetAdminCompetitionDocument,
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
  teamId: string
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
  const { data: compData } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
  })
  // チーム一覧は AddEntryDialog が自前で取得する
  const { data: competitionsData } = useGetAdminCompetitionsQuery()
  const { data: promotionRulesData } = useGetAdminPromotionRulesQuery({
    variables: { sourceCompetitionId: competitionId },
    skip: !competitionId,
  })

  const league = leagueData?.league
  const competitionTeams = compData?.competition?.teams ?? []

  const [form, setForm] = useState<LeagueForm>({
    name: leagueName,
    description: '',
    weight: '0',
    matchFormat: 'sunny',
    resultJudgments: ['score'],
    tag: '',
  })

  // GraphQL の competition.teams をエントリーとして使用
  const entries: LeagueEntry[] = competitionTeams.map((t, i) => ({
    id: i + 1,
    teamName: t.name,
    teamClass: t.group.name,
    teamId: t.id,
  }))

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [progressionEnabled, setProgressionEnabled] = useState(false)
  const [progressionMaxRank, setProgressionMaxRank] = useState(3)
  const [progressionRules, setProgressionRules] = useState<ProgressionRule[]>([])
  const [ruleIdByRank, setRuleIdByRank] = useState<Record<number, string>>({})

  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [updateLeagueRule] = useUpdateAdminLeagueRuleMutation()
  const [createPromotionRule] = useCreateAdminPromotionRuleMutation({
    refetchQueries: [{ query: GetAdminPromotionRulesDocument, variables: { sourceCompetitionId: competitionId } }],
  })
  const [deletePromotionRule] = useDeleteAdminPromotionRuleMutation({
    refetchQueries: [{ query: GetAdminPromotionRulesDocument, variables: { sourceCompetitionId: competitionId } }],
  })
  const [addCompetitionEntries] = useAddAdminCompetitionEntriesMutation({
    refetchQueries: [{ query: GetAdminCompetitionDocument, variables: { id: competitionId } }],
  })
  const [deleteCompetitionEntries] = useDeleteAdminCompetitionEntriesMutation({
    refetchQueries: [{ query: GetAdminCompetitionDocument, variables: { id: competitionId } }],
  })

  // GQL データで初期化
  useEffect(() => {
    if (league?.name !== undefined) {
      setForm(prev => ({ ...prev, name: league.name }))
    }
  }, [league?.name])

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
  }

  const handleUpdateLeagueRule = async (winPt: number, drawPt: number, losePt: number) => {
    try {
      await updateLeagueRule({
        variables: { id: leagueId, input: { winPt, drawPt, losePt } },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const handleDeleteEntry = async (id: number) => {
    const entry = entries.find(e => e.id === id)
    if (!entry?.teamId) return
    try {
      await deleteCompetitionEntries({
        variables: {
          id: competitionId,
          input: { teamIds: [entry.teamId] },
        },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const handleOpenAddDialog = () => setAddDialogOpen(true)
  const handleCloseAddDialog = () => setAddDialogOpen(false)

  const handleAddEntries = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return
    try {
      await addCompetitionEntries({
        variables: {
          id: competitionId,
          input: { teamIds: selectedIds },
        },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
    setAddDialogOpen(false)
  }

  const handleProgressionRuleChange = async (rank: number, targetId: string) => {
    const existingId = ruleIdByRank[rank]
    try {
      if (existingId) {
        await deletePromotionRule({ variables: { id: existingId } })
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
        })
      }
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
    }
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
    handleUpdateLeagueRule,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionMaxRank,
    handleProgressionRuleChange,
    loading,
    error: error ?? null,
    mutationError,
  }
}
