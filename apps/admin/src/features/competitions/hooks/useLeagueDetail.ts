import { useState, useEffect, useMemo } from 'react'
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

import { showErrorToast } from '@/lib/toast'
import type { ProgressionRule, ProgressionTarget } from '../types'

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

export function useLeagueDetail(leagueId: string, leagueName: string, competitionId: string) {
  // ─── データ取得 ──────────────────────────────────────
  const { data: leagueData, loading, error } = useGetAdminLeagueQuery({
    variables: { id: leagueId },
    skip: !leagueId,
  })
  const { data: compData } = useGetAdminCompetitionQuery({
    variables: { id: competitionId },
    skip: !competitionId,
  })
  const { data: competitionsData } = useGetAdminCompetitionsQuery()
  const { data: promotionRulesData } = useGetAdminPromotionRulesQuery({
    variables: { sourceCompetitionId: competitionId },
    skip: !competitionId,
  })
  const { data: sportsData } = useGetAdminSportsWithScenesQuery()

  // ─── API から取得した「保存済み」の値（常に最新を反映） ──────
  const league = leagueData?.league
  const competition = compData?.competition

  const serverName = league?.name ?? leagueName
  const serverSportId = competition?.sport?.id ?? ''
  const serverSceneId = competition?.scene?.id ?? ''
  const serverWinPt = league?.winPt ?? 3
  const serverDrawPt = league?.drawPt ?? 1
  const serverLosePt = league?.losePt ?? 0

  const allSports = sportsData?.sports ?? []
  const sports = useMemo(() => allSports.map(s => ({ id: s.id, name: s.name })), [allSports])
  const competitionTeams = competition?.teams ?? []

  const entries: LeagueEntry[] = useMemo(
    () => competitionTeams.map((t, i) => ({
      id: i + 1,
      teamName: t.name,
      teamClass: t.group.name,
      teamId: t.id,
    })),
    [competitionTeams],
  )

  // ─── ユーザー編集差分（null = 未編集 → サーバー値を使う） ───
  const [editName, setEditName] = useState<string | null>(null)
  const [editSportId, setEditSportId] = useState<string | null>(null)
  const [editSceneId, setEditSceneId] = useState<string | null>(null)
  const [editWinPt, setEditWinPt] = useState<number | null>(null)
  const [editDrawPt, setEditDrawPt] = useState<number | null>(null)
  const [editLosePt, setEditLosePt] = useState<number | null>(null)

  // 実効値: ユーザー編集があればそれ、なければサーバー値
  const form: LeagueForm = {
    name: editName ?? serverName,
    sportId: editSportId ?? serverSportId,
    sceneId: editSceneId ?? serverSceneId,
    winPt: editWinPt ?? serverWinPt,
    drawPt: editDrawPt ?? serverDrawPt,
    losePt: editLosePt ?? serverLosePt,
  }

  // ─── 自動進出 ──────────────────────────────────────
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
  const [savedProgressionRules, setSavedProgressionRules] = useState<ProgressionRule[]>([])
  const [ruleIdByRank, setRuleIdByRank] = useState<Record<number, string>>({})
  const [promotionInitialized, setPromotionInitialized] = useState(false)

  const [mutationError, setMutationError] = useState<Error | null>(null)

  // ─── mutations ─────────────────────────────────────
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

  // ─── プログレッションルール初期化 ─────────────────────
  useEffect(() => {
    if (!promotionRulesData?.promotionRules) return
    const rules = promotionRulesData.promotionRules
    setProgressionRules(rules.map(r => ({
      rank: parseInt(r.rankSpec),
      targetId: r.targetCompetition.id,
    })))
    if (!promotionInitialized) {
      setPromotionInitialized(true)
      setProgressionEnabled(rules.length > 0)
      setSavedProgressionRules(rules.map(r => ({
        rank: parseInt(r.rankSpec),
        targetId: r.targetCompetition.id,
      })))
      if (rules.length > 0) {
        const ranks = rules.map(r => parseInt(r.rankSpec))
        _setProgressionRankRange([Math.min(...ranks), Math.max(...ranks)])
      }
    }
    const idMap: Record<number, string> = {}
    for (const r of rules) {
      idMap[parseInt(r.rankSpec)] = r.id
    }
    setRuleIdByRank(idMap)
  }, [promotionRulesData?.promotionRules]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── dirty 検出 ─────────────────────────────────────
  const effectiveProgressionRules = progressionEnabled
    ? progressionRules.filter(r => r.rank >= clampedRankRange[0] && r.rank <= clampedRankRange[1] && r.targetId)
    : []
  const progressionDirty = effectiveProgressionRules.length !== savedProgressionRules.length
    || effectiveProgressionRules.some(e => {
      const s = savedProgressionRules.find(sr => sr.rank === e.rank)
      return !s || s.targetId !== e.targetId
    })

  const dirty = editName !== null || editSportId !== null || editSceneId !== null
    || editWinPt !== null || editDrawPt !== null || editLosePt !== null
    || progressionDirty

  // ─── ハンドラー ─────────────────────────────────────
  const handleChange = (field: keyof LeagueForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'winPt' || field === 'drawPt' || field === 'losePt' ? Number(e.target.value) : e.target.value
    switch (field) {
      case 'name': setEditName(value as string); break
      case 'winPt': setEditWinPt(value as number); break
      case 'drawPt': setEditDrawPt(value as number); break
      case 'losePt': setEditLosePt(value as number); break
    }
  }

  const handleSave = async () => {
    const n = form.name.trim().slice(0, 64)
    if (!n) return
    if ([form.winPt, form.drawPt, form.losePt].some(v => v < 0 || !Number.isInteger(v))) return
    try {
      await updateCompetition({
        variables: { id: competitionId, input: { name: n, sportId: form.sportId || undefined, sceneId: form.sceneId || undefined } },
        refetchQueries: ['GetAdminCompetitions', 'GetAdminCompetition'],
      })
      if (editWinPt !== null || editDrawPt !== null || editLosePt !== null) {
        await updateLeagueRule({
          variables: { id: leagueId, input: { winPt: form.winPt, drawPt: form.drawPt, losePt: form.losePt } },
        })
      }

      // プログレッションルールの差分保存
      if (progressionDirty) {
        const desiredRules = effectiveProgressionRules
        for (const sr of savedProgressionRules) {
          const desired = desiredRules.find(r => r.rank === sr.rank)
          const ruleId = ruleIdByRank[sr.rank]
          if (ruleId && (!desired || desired.targetId !== sr.targetId)) {
            await deletePromotionRule({ variables: { id: ruleId } })
          }
        }
        for (const rule of desiredRules) {
          const sr = savedProgressionRules.find(r => r.rank === rule.rank)
          if (!sr || sr.targetId !== rule.targetId) {
            await createPromotionRule({
              variables: {
                input: {
                  sourceCompetitionId: competitionId,
                  targetCompetitionId: rule.targetId,
                  rankSpec: String(rule.rank),
                },
              },
            })
          }
        }
        setSavedProgressionRules(desiredRules)
      }

      // 保存完了 → 編集差分をクリア（サーバー値に戻る）
      setEditName(null)
      setEditSportId(null)
      setEditSceneId(null)
      setEditWinPt(null)
      setEditDrawPt(null)
      setEditLosePt(null)
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
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
      showErrorToast()
    }
  }

  const handleDeleteEntry = async (id: number) => {
    const entry = entries.find(e => e.id === id)
    if (!entry?.teamId) return
    try {
      await deleteCompetitionEntries({
        variables: { id: competitionId, input: { teamIds: [entry.teamId] } },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const handleOpenAddDialog = () => setAddDialogOpen(true)
  const handleCloseAddDialog = () => setAddDialogOpen(false)

  const handleAddEntries = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return
    try {
      await addCompetitionEntries({
        variables: { id: competitionId, input: { teamIds: selectedIds } },
      })
      setMutationError(null)
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  const handleProgressionRuleChange = (rank: number, targetId: string) => {
    setProgressionRules(prev => {
      const existing = prev.find(r => r.rank === rank)
      if (existing) return prev.map(r => r.rank === rank ? { ...r, targetId } : r)
      return [...prev, { rank, targetId }]
    })
  }

  // ─── 進出先候補 ─────────────────────────────────────
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

  // ─── シーン候補（選択中の競技に紐づくもの） ──────────────
  const selectedSport = allSports.find(s => s.id === form.sportId)
  const scenes = useMemo(
    () => (selectedSport?.scene ?? []).map(ss => ({ id: ss.scene.id, name: ss.scene.name })),
    [selectedSport],
  )

  const setSportId = (id: string) => {
    setEditSportId(id)
    setEditSceneId('')
  }
  const setSceneId = (id: string) => {
    setEditSceneId(id)
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
