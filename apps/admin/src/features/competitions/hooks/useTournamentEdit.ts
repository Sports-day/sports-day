import { useState, useEffect, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import {
  useGetAdminTournamentQuery,
  useGetAdminTournamentsQuery,
  useGetAdminCompetitionQuery,
  useGetAdminCompetitionsQuery,
  useGetAdminPromotionRulesQuery,
  useGetAdminSportsWithScenesQuery,
  useUpdateAdminTournamentMutation,
  useDeleteAdminTournamentMutation,
  useUpdateAdminCompetitionMutation,
  useDeleteAdminCompetitionMutation,
  GetAdminCompetitionsDocument,
  useCreateAdminPromotionRuleMutation,
  useDeleteAdminPromotionRuleMutation,
  useAddAdminCompetitionEntriesMutation,
  useDeleteAdminCompetitionEntriesMutation,
  useUpdateAdminSlotConnectionMutation,
  useGenerateAdminSubBracketMutation,
  useGenerateAdminBracketMutation,
  GetAdminTournamentsDocument,
  GetAdminPromotionRulesDocument,
  GetAdminCompetitionDocument,
  CompetitionType,
  SlotSourceType,
} from '@/gql/__generated__/graphql'
import type { ProgressionRule, ProgressionTarget } from '../types'

type PlacementMethod = 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'

type TournamentEntry = {
  id: number
  teamName: string
  teamClass: string
  teamId: string
}

export function useTournamentEdit(competitionId: string, competitionName: string) {
  // ─── データ取得 ──────────────────────────────────────
  const { data: tournamentsData } = useGetAdminTournamentsQuery({
    variables: { competitionId },
    skip: !competitionId,
  })
  const mainTournament = tournamentsData?.tournaments?.find(t => t.bracketType === 'MAIN')
  const resolvedTournamentId = mainTournament?.id ?? ''

  const { data: tournamentData } = useGetAdminTournamentQuery({
    variables: { id: resolvedTournamentId },
    skip: !resolvedTournamentId,
  })
  const tournament = tournamentData?.tournament

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
  const competition = compData?.competition
  const serverName = competition?.name ?? competitionName
  const serverSportId = competition?.sport?.id ?? ''
  const serverSceneId = competition?.scene?.id ?? ''

  const allSports = sportsData?.sports ?? []
  const sports = useMemo(() => allSports.map(s => ({ id: s.id, name: s.name })), [allSports])
  const competitionTeams = competition?.teams ?? []

  const entries: TournamentEntry[] = useMemo(
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
  const [editTeamCount, setEditTeamCount] = useState<number | null>(null)
  const [editPlacementMethod, setEditPlacementMethod] = useState<PlacementMethod | null>(null)

  // サーバー値
  const serverTeamCount = tournament?.slots?.filter(s => s.sourceType === 'SEED').length || 4
  const serverPlacementMethod = (tournament?.placementMethod ?? 'SEED_OPTIMIZED') as PlacementMethod

  // 実効値: ユーザー編集があればそれ、なければサーバー値
  const form = {
    name: editName ?? serverName,
    sportId: editSportId ?? serverSportId,
    sceneId: editSceneId ?? serverSceneId,
  }

  const teamCount = editTeamCount ?? serverTeamCount
  const placementMethod = editPlacementMethod ?? serverPlacementMethod
  const bracketNeedsGeneration = !mainTournament
  const bracketChanged = editTeamCount !== null || editPlacementMethod !== null

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

  // ─── SUBブラケットデータ ─────────────────────────────
  const subBrackets = useMemo(
    () => (tournamentsData?.tournaments ?? [])
      .filter(t => t.bracketType === 'SUB')
      .sort((a, b) => (a.name > b.name ? 1 : -1)),
    [tournamentsData?.tournaments],
  )

  // ─── mutations ─────────────────────────────────────
  const refetchTournaments = competitionId
    ? [{ query: GetAdminTournamentsDocument, variables: { competitionId } }]
    : []
  const [updateTournament] = useUpdateAdminTournamentMutation()
  const [deleteTournament] = useDeleteAdminTournamentMutation({
    refetchQueries: refetchTournaments,
  })
  const [generateSubBracket] = useGenerateAdminSubBracketMutation({
    refetchQueries: [...refetchTournaments, 'GetAdminTournament'],
  })
  const [generateBracket] = useGenerateAdminBracketMutation({
    refetchQueries: [...refetchTournaments, 'GetAdminTournament'],
  })
  const [updateSlotConnection] = useUpdateAdminSlotConnectionMutation({
    refetchQueries: ['GetAdminTournament'],
  })
  const [updateCompetition] = useUpdateAdminCompetitionMutation()
  const [deleteCompetition] = useDeleteAdminCompetitionMutation({
    refetchQueries: [{ query: GetAdminCompetitionsDocument }],
  })
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
    || bracketNeedsGeneration || bracketChanged || progressionDirty

  // ─── ハンドラー ─────────────────────────────────────
  const handleChange = (field: 'name' | 'sportId' | 'sceneId' | 'teamCount' | 'placementMethod') => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field === 'teamCount') {
      setEditTeamCount(Number(e.target.value))
    } else if (field === 'placementMethod') {
      setEditPlacementMethod(e.target.value as PlacementMethod)
    } else if (field === 'name') {
      setEditName(e.target.value)
    }
  }

  const handleSave = async () => {
    const n = form.name.trim().slice(0, 64)
    if (!n) return
    // トーナメント名の更新
    if (editName !== null && resolvedTournamentId) {
      await updateTournament({
        variables: { id: resolvedTournamentId, input: { name: n } },
      })
    }
    // competition（名前/競技/タグ）の更新
    await updateCompetition({
      variables: { id: competitionId, input: { name: n, sportId: form.sportId || undefined, sceneId: form.sceneId || undefined } },
      refetchQueries: ['GetAdminCompetitions', 'GetAdminCompetition'],
    })

    // ブラケット生成/再生成（既存があればAPI側で自動リセット）
    if (bracketNeedsGeneration || bracketChanged) {
      await generateBracket({
        variables: {
          input: {
            competitionId,
            teamCount,
            placementMethod: placementMethod as string,
          },
        },
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
    setEditTeamCount(null)
    setEditPlacementMethod(null)
  }

  const handleDelete = async () => {
    await deleteCompetition({ variables: { id: competitionId } })
  }

  const handleDeleteEntry = async (id: number) => {
    const entry = entries.find(e => e.id === id)
    if (!entry?.teamId) return
    await deleteCompetitionEntries({
      variables: { id: competitionId, input: { teamIds: [entry.teamId] } },
    })
  }

  const handleOpenAddDialog = () => setAddDialogOpen(true)
  const handleCloseAddDialog = () => setAddDialogOpen(false)

  const handleAddEntries = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return
    await addCompetitionEntries({
      variables: { id: competitionId, input: { teamIds: selectedIds } },
    })
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
    setEditSceneId('')  // 競技を変えたらタグをリセット
  }
  const setSceneId = (id: string) => {
    setEditSceneId(id)
  }

  // ─── SUBブラケット操作 ─────────────────────────────
  const handleCreateSubBracket = async (name: string, subTeamCount?: number, subPlacementMethod?: PlacementMethod) => {
    await generateSubBracket({
      variables: {
        input: {
          competitionId,
          name,
          teamCount: subTeamCount ?? 2,
          placementMethod: subPlacementMethod ?? undefined,
        },
      },
    })
  }

  const handleDeleteSubBracket = async (bracketId: string) => {
    await deleteTournament({ variables: { id: bracketId } })
  }

  const handleUpdateSubBracketName = async (bracketId: string, name: string) => {
    await updateTournament({
      variables: { id: bracketId, input: { name: name.trim().slice(0, 64) } },
      refetchQueries: refetchTournaments,
    })
  }

  const handleRegenerateSubBracket = async (bracketId: string, name: string, subTeamCount: number, subPlacementMethod: PlacementMethod) => {
    await deleteTournament({ variables: { id: bracketId } })
    await generateSubBracket({
      variables: {
        input: {
          competitionId,
          name,
          teamCount: subTeamCount,
          placementMethod: subPlacementMethod,
        },
      },
    })
  }

  const handleUpdateSlotSource = async (
    slotId: string,
    sourceType: 'SEED' | 'MATCH_WINNER' | 'MATCH_LOSER',
    sourceMatchId?: string,
    seedNumber?: number,
  ) => {
    const gqlSourceType =
      sourceType === 'MATCH_WINNER' ? SlotSourceType.MatchWinner
        : sourceType === 'MATCH_LOSER' ? SlotSourceType.MatchLoser
        : SlotSourceType.Seed
    await updateSlotConnection({
      variables: {
        input: {
          slotId,
          sourceType: gqlSourceType,
          sourceMatchId: sourceMatchId ?? null,
          seedNumber: seedNumber ?? null,
        },
      },
    })
  }

  return {
    form,
    dirty,
    teamCount,
    placementMethod,
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
    subBrackets,
    handleChange,
    handleSave,
    handleDelete,
    handleDeleteEntry,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddEntries,
    setProgressionEnabled,
    setProgressionRankRange,
    handleProgressionRuleChange,
    handleCreateSubBracket,
    handleDeleteSubBracket,
    handleUpdateSubBracketName,
    handleRegenerateSubBracket,
    handleUpdateSlotSource,
  }
}
