import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminLeagueQuery,
  useGetAdminCompetitionsQuery,
  useGetAdminCompetitionQuery,
  useGetAdminPromotionRulesQuery,
  useGetAdminSportsWithScenesQuery,
  useUpdateAdminCompetitionMutation,
  useDeleteAdminLeagueMutation,
  useUpdateAdminLeagueRuleMutation,
  useCreateAdminPromotionRuleMutation,
  useDeleteAdminPromotionRuleMutation,
  useAddAdminCompetitionEntriesMutation,
  useDeleteAdminCompetitionEntriesMutation,
  GetAdminPromotionRulesDocument,
  GetAdminCompetitionDocument,
  GetAdminCompetitionsDocument,
  CompetitionType,
} from '@/gql/__generated__/graphql'

type LeagueForm = {
  name: string
  sportId: string
  sceneId: string
  winPt: number
  drawPt: number
  losePt: number
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

  const { data: sportsData } = useGetAdminSportsWithScenesQuery()
  const allSports = sportsData?.sports ?? []
  const sports = allSports.map(s => ({ id: s.id, name: s.name }))

  const league = leagueData?.league
  const competitionTeams = compData?.competition?.teams ?? []

  const [form, setForm] = useState<LeagueForm>({
    name: leagueName,
    sportId: '',
    sceneId: '',
    winPt: 3,
    drawPt: 1,
    losePt: 0,
  })

  // 比較ベースのdirty検出
  const [saved, setSaved] = useState<LeagueForm>({
    name: leagueName,
    sportId: '',
    sceneId: '',
    winPt: 3,
    drawPt: 1,
    losePt: 0,
  })
  const initialized = useRef(false)

  // GraphQL の competition.teams をエントリーとして使用
  const entries: LeagueEntry[] = competitionTeams.map((t, i) => ({
    id: i + 1,
    teamName: t.name,
    teamClass: t.group.name,
    teamId: t.id,
  }))

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [progressionEnabled, setProgressionEnabled] = useState(false)
  const [progressionRankRange, _setProgressionRankRange] = useState<[number, number]>([1, 3])
  const maxAllowed = Math.max(1, entries.length)
  const clampedRankRange: [number, number] = [
    Math.min(progressionRankRange[0], maxAllowed),
    Math.min(progressionRankRange[1], maxAllowed),
  ]
  const setProgressionRankRange = (range: [number, number]) => {
    _setProgressionRankRange([Math.min(range[0], maxAllowed), Math.min(range[1], maxAllowed)])
  }
  const [progressionRules, setProgressionRules] = useState<ProgressionRule[]>([])
  const [ruleIdByRank, setRuleIdByRank] = useState<Record<number, string>>({})

  const [mutationError, setMutationError] = useState<Error | null>(null)

  const [updateCompetition] = useUpdateAdminCompetitionMutation()
  const [deleteLeague] = useDeleteAdminLeagueMutation({
    refetchQueries: [{ query: GetAdminCompetitionsDocument }],
  })
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

  // 初回のみAPIデータでフォームを初期化
  useEffect(() => {
    if (!league || !compData?.competition || initialized.current) return
    initialized.current = true
    const competition = compData.competition
    const snap: LeagueForm = {
      name: league.name,
      sportId: competition?.sport?.id ?? '',
      sceneId: competition?.scene?.id ?? '',
      winPt: league.winPt,
      drawPt: league.drawPt,
      losePt: league.losePt,
    }
    setForm(snap)
    setSaved(snap)
  }, [league, compData])

  useEffect(() => {
    if (promotionRulesData?.promotionRules) {
      const rules = promotionRulesData.promotionRules
      setProgressionRules(rules.map(r => ({
        rank: parseInt(r.rankSpec),
        targetId: r.targetCompetition.id,
      })))
      setProgressionEnabled(rules.length > 0)
      if (rules.length > 0) {
        const ranks = rules.map(r => parseInt(r.rankSpec))
        _setProgressionRankRange([Math.min(...ranks), Math.max(...ranks)])
      }
      const idMap: Record<number, string> = {}
      for (const r of rules) {
        idMap[parseInt(r.rankSpec)] = r.id
      }
      setRuleIdByRank(idMap)
    }
  }, [promotionRulesData?.promotionRules])

  const dirty = form.name !== saved.name || form.sportId !== saved.sportId || form.sceneId !== saved.sceneId || form.winPt !== saved.winPt || form.drawPt !== saved.drawPt || form.losePt !== saved.losePt

  const handleChange = (field: keyof LeagueForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'winPt' || field === 'drawPt' || field === 'losePt' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    const n = form.name.trim()
    if (!n) return
    await updateCompetition({
      variables: { id: competitionId, input: { name: n, sportId: form.sportId || undefined, sceneId: form.sceneId || undefined } },
      refetchQueries: ['GetAdminCompetitions', 'GetAdminCompetition'],
    })
    if (form.winPt !== saved.winPt || form.drawPt !== saved.drawPt || form.losePt !== saved.losePt) {
      await updateLeagueRule({
        variables: { id: leagueId, input: { winPt: form.winPt, drawPt: form.drawPt, losePt: form.losePt } },
      })
    }
    setSaved({ ...form, name: n })
  }

  const handleDelete = async () => {
    await deleteLeague({ variables: { id: leagueId } })
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

  // 同一競技に属する他大会を候補として提示（リーグ・トーナメント分離）
  const currentSportId = form.sportId
  const allTargets: ProgressionTarget[] = (competitionsData?.competitions ?? [])
    .filter(c => c.id !== competitionId && c.sport?.id === currentSportId)
    .map(c => ({
      id: c.id,
      name: c.name,
      type: c.type === CompetitionType.League ? 'league' : 'tournament',
    }))
  const availableProgressionTargets = {
    leagues: allTargets.filter(t => t.type === 'league'),
    tournaments: allTargets.filter(t => t.type === 'tournament'),
  }

  // 選択中の競技に紐づくシーンだけをフィルタ
  const selectedSport = allSports.find(s => s.id === form.sportId)
  const scenes = (selectedSport?.scene ?? []).map(ss => ({ id: ss.scene.id, name: ss.scene.name }))

  const setSportId = (id: string) => {
    setForm(prev => prev.sportId === id ? prev : { ...prev, sportId: id, sceneId: '' })
  }
  const setSceneId = (id: string) => {
    setForm(prev => ({ ...prev, sceneId: id }))
  }

  return {
    form,
    dirty,
    entries,
    sports,
    scenes,
    setSportId,
    setSceneId,
    addDialogOpen,
    progressionEnabled,
    progressionRankRange: clampedRankRange,
    progressionRules,
    availableProgressionTargets,
    handleChange,
    handleSave,
    handleDelete,
    handleUpdateLeagueRule,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionRankRange,
    handleProgressionRuleChange,
    loading,
    error: error ?? null,
    mutationError,
  }
}
