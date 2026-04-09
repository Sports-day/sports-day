import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { navigateToPage } from '@/hooks/useAppNavigation'
import {
  BREADCRUMB_CURRENT_SX,
  BREADCRUMB_LINK_SX,
  CARD_FIELD_SX,
  CARD_GRADIENT,
  CARD_TABLE_HEAD_SX,
  CARD_TABLE_CELL_SX,
  DELETE_BUTTON_SX,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
import { showToast, showErrorToast } from '@/lib/toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ProgressionRulesEditor } from './ProgressionRulesEditor'
import { AddEntryDialog } from './AddEntryDialog'
import { SportSelect } from './SportSelect'
import { SceneSelect } from '@/components/ui/SceneSelect'
import { useApolloClient } from '@apollo/client'
import {
  useUpdateAdminSlotConnectionMutation,
  useUpdateAdminMatchDetailMutation,
  useUpdateAdminJudgmentMutation,
  useAssignAdminSeedTeamMutation,
  SlotSourceType,
} from '@/gql/__generated__/graphql'
import { GET_ADMIN_MATCH } from '@/features/matches/api'
import { useTournamentDetail } from '../hooks/useTournamentDetail'
import { TournamentBracketView } from './TournamentBracketView'
import { useTournamentEdit } from '../hooks/useTournamentEdit'
import { useSeedAssignment } from '@/hooks/useSeedAssignment'
import type { TournamentMatchView } from '../types'

const PLACEMENT_OPTIONS = [
  { value: 'SEED_OPTIMIZED', label: 'シード最適化（上位シード同士が終盤まで当たらない）' },
  { value: 'BALANCED', label: '均等配置（上位と下位が序盤で対戦）' },
  { value: 'RANDOM', label: 'ランダム配置' },
  { value: 'MANUAL', label: '手動配置（進出ルールでスロットを個別指定）' },
]

type Props = {
  tournamentId: string
  tournamentName: string
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
  onSaved?: (newName: string) => void
  onDeleted?: () => void
}

export function TournamentDetailPage({
  tournamentName,
  competitionId,
  competitionName,
  onBackToList,
  onBackToDetail: _onBackToDetail,
  onSaved,
  onDeleted,
}: Props) {
  const data = useTournamentDetail(competitionId, tournamentName)

  const {
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
    progressionRankRange,
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
  } = useTournamentEdit(competitionId, competitionName)

  const [activeBracketId, setActiveBracketId] = useState('')
  const seed = useSeedAssignment(activeBracketId)
  const client = useApolloClient()
  const [updateSlotConn] = useUpdateAdminSlotConnectionMutation()
  const [updateMatchDetail] = useUpdateAdminMatchDetailMutation()
  const [updateJudgment] = useUpdateAdminJudgmentMutation()
  const [assignSeedTeam] = useAssignAdminSeedTeamMutation()

  const SLOT_SOURCE_TYPE_MAP: Record<string, SlotSourceType> = {
    SEED: SlotSourceType.Seed,
    MATCH_WINNER: SlotSourceType.MatchWinner,
    MATCH_LOSER: SlotSourceType.MatchLoser,
  }

  const handleSwapMatches = async (
    matchA: TournamentMatchView,
    matchB: TournamentMatchView,
    bracketId: string,
  ) => {
    type MatchDetail = {
      time?: string | null
      location?: { id: string } | null
      judgment?: { user?: { id: string } | null; team?: { id: string } | null; group?: { id: string } | null } | null
    }

    // スロットIDの検証
    if (!matchA.slot1.slotId || !matchA.slot2.slotId || !matchB.slot1.slotId || !matchB.slot2.slotId) {
      showErrorToast('スロット情報が不完全なため入れ替えできません')
      return
    }

    // ① スワップ前の試合付帯情報を取得（ロールバック用 & 交換用）
    let dA: MatchDetail | undefined
    let dB: MatchDetail | undefined
    try {
      const [resA, resB] = await Promise.all([
        client.query<{ match: MatchDetail }>({ query: GET_ADMIN_MATCH, variables: { id: matchA.id }, fetchPolicy: 'network-only' }),
        client.query<{ match: MatchDetail }>({ query: GET_ADMIN_MATCH, variables: { id: matchB.id }, fetchPolicy: 'network-only' }),
      ])
      dA = resA.data?.match
      dB = resB.data?.match
    } catch {
      showErrorToast('試合情報の取得に失敗しました')
      return
    }

    const toJudgmentEntry = (j: MatchDetail['judgment']) => {
      if (j?.user?.id) return { userId: j.user.id }
      if (j?.team?.id) return { teamId: j.team.id }
      if (j?.group?.id) return { groupId: j.group.id }
      return {}
    }

    // 試合付帯情報（time / location / judgment）の交換
    const swapDetails = async () => {
      await Promise.all([
        updateMatchDetail({ variables: { id: matchA.id, input: { time: dB?.time ?? undefined, locationId: dB?.location?.id ?? undefined } }, refetchQueries: [] }),
        updateMatchDetail({ variables: { id: matchB.id, input: { time: dA?.time ?? undefined, locationId: dA?.location?.id ?? undefined } }, refetchQueries: [] }),
      ])
      await Promise.all([
        updateJudgment({ variables: { id: matchA.id, input: { entry: toJudgmentEntry(dB?.judgment) } }, refetchQueries: [] }),
        updateJudgment({ variables: { id: matchB.id, input: { entry: toJudgmentEntry(dA?.judgment) } }, refetchQueries: [] }),
      ])
    }

    // 試合付帯情報を元に戻す
    const restoreDetails = async () => {
      await Promise.allSettled([
        updateMatchDetail({ variables: { id: matchA.id, input: { time: dA?.time ?? undefined, locationId: dA?.location?.id ?? undefined } } }),
        updateMatchDetail({ variables: { id: matchB.id, input: { time: dB?.time ?? undefined, locationId: dB?.location?.id ?? undefined } } }),
      ])
      await Promise.allSettled([
        updateJudgment({ variables: { id: matchA.id, input: { entry: toJudgmentEntry(dA?.judgment) } } }),
        updateJudgment({ variables: { id: matchB.id, input: { entry: toJudgmentEntry(dB?.judgment) } } }),
      ])
    }

    const allSeed = [matchA.slot1, matchA.slot2, matchB.slot1, matchB.slot2].every(s => s.sourceType === 'SEED')

    if (allSeed) {
      // ═══ Case 1: 全スロットが SEED → assignSeedTeam で直接交換 ═══
      // assignSeedTeam は clearSeedTeamsIfReady を呼ばないので安全
      const swaps = [
        { slotId: matchA.slot1.slotId!, teamId: matchB.slot1.teamId ?? null },
        { slotId: matchA.slot2.slotId!, teamId: matchB.slot2.teamId ?? null },
        { slotId: matchB.slot1.slotId!, teamId: matchA.slot1.teamId ?? null },
        { slotId: matchB.slot2.slotId!, teamId: matchA.slot2.teamId ?? null },
      ]
      const originals = [
        { slotId: matchA.slot1.slotId!, teamId: matchA.slot1.teamId ?? null },
        { slotId: matchA.slot2.slotId!, teamId: matchA.slot2.teamId ?? null },
        { slotId: matchB.slot1.slotId!, teamId: matchB.slot1.teamId ?? null },
        { slotId: matchB.slot2.slotId!, teamId: matchB.slot2.teamId ?? null },
      ]
      try {
        for (const { slotId, teamId } of swaps) {
          await assignSeedTeam({ variables: { input: { slotId, teamId } }, refetchQueries: [] })
        }
        await swapDetails()
        await client.refetchQueries({ include: ['GetAdminTournament'] })
        showToast('試合の組み合わせを入れ替えました')
      } catch {
        try {
          for (const { slotId, teamId } of originals) {
            try { await assignSeedTeam({ variables: { input: { slotId, teamId } }, refetchQueries: [] }) } catch { /* 続行 */ }
          }
          await restoreDetails()
          await client.refetchQueries({ include: ['GetAdminTournament'] })
          showErrorToast('入れ替えに失敗しました。元の状態に戻しました。')
        } catch {
          showErrorToast('入れ替えに失敗しました。元の状態への復元にも失敗したため、手動で確認してください。')
        }
      }
    } else {
      // ═══ Case 2: MATCH_WINNER/MATCH_LOSER → 接続変更 + シード復元 ═══
      // updateSlotConnection は clearSeedTeamsIfReady を呼ぶため、
      // 事前にブラケット全体のシード割当を保存し、接続変更後に復元する
      const bracket = data.brackets.find(b => b.id === bracketId)
      if (!bracket) { showErrorToast('ブラケット情報が見つかりません'); return }

      const savedSeeds = bracket.matches
        .flatMap(m => [m.slot1, m.slot2])
        .filter(s => s.sourceType === 'SEED' && s.slotId && s.teamId)
        .map(s => ({ slotId: s.slotId!, teamId: s.teamId! }))

      const restoreSeeds = async () => {
        for (const { slotId, teamId } of savedSeeds) {
          try { await assignSeedTeam({ variables: { input: { slotId, teamId } }, refetchQueries: [] }) } catch { /* 続行 */ }
        }
      }

      const applySlotConn = (slotId: string, from: TournamentMatchView['slot1']) =>
        updateSlotConn({
          variables: {
            input: {
              slotId,
              sourceType: SLOT_SOURCE_TYPE_MAP[from.sourceType],
              sourceMatchId: from.sourceMatchId ?? null,
              seedNumber: from.seedNumber ?? null,
            },
          },
          refetchQueries: [],
        })

      const slotSwaps = [
        { slotId: matchA.slot1.slotId!, from: matchB.slot1 },
        { slotId: matchA.slot2.slotId!, from: matchB.slot2 },
        { slotId: matchB.slot1.slotId!, from: matchA.slot1 },
        { slotId: matchB.slot2.slotId!, from: matchA.slot2 },
      ]

      try {
        // ② 接続交換（全 SEED チーム割当がクリアされる）
        for (const { slotId, from } of slotSwaps) {
          await applySlotConn(slotId, from)
        }
        // ③ 保存しておいたシード割当を復元
        await restoreSeeds()
        // ④ 試合付帯情報を交換
        await swapDetails()
        await client.refetchQueries({ include: ['GetAdminTournament'] })
        showToast('試合の組み合わせを入れ替えました')
      } catch {
        try {
          // ロールバック: 接続を元に戻す（シードは既にクリア済みなので再クリアされない）
          const origSlots = [
            { slotId: matchA.slot1.slotId!, from: matchA.slot1 },
            { slotId: matchA.slot2.slotId!, from: matchA.slot2 },
            { slotId: matchB.slot1.slotId!, from: matchB.slot1 },
            { slotId: matchB.slot2.slotId!, from: matchB.slot2 },
          ]
          for (const { slotId, from } of origSlots) {
            try { await applySlotConn(slotId, from) } catch { /* 続行 */ }
          }
          // シード復元
          await restoreSeeds()
          // 試合付帯情報を元に戻す
          await restoreDetails()
          await client.refetchQueries({ include: ['GetAdminTournament'] })
          showErrorToast('入れ替えに失敗しました。元の状態に戻しました。')
        } catch {
          showErrorToast('入れ替えに失敗しました。元の状態への復元にも失敗したため、手動で確認してください。')
        }
      }
    }
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subDeleteTarget, setSubDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [subEdits, setSubEdits] = useState<Record<string, { teamCount?: number; placement?: string }>>({})
  const [subCreateName, setSubCreateName] = useState('')
  const [subCreateTeamCount, setSubCreateTeamCount] = useState(4)
  const [subCreatePlacement, setSubCreatePlacement] = useState('SEED_OPTIMIZED')
  const [showSubCreateInput, setShowSubCreateInput] = useState(false)
  const [seedPopover, setSeedPopover] = useState<{
    anchorEl: HTMLElement
    seedNumber: number
    slotId: string | undefined
    currentTeamId: string | null | undefined
  } | null>(null)
  useUnsavedWarning(dirty)

  const handleSeedClick = (seedNumber: number, currentTeamId: string | null | undefined, anchorEl: HTMLElement, bracketId: string, slotId: string | undefined) => {
    setActiveBracketId(bracketId)
    setSeedPopover({ anchorEl, seedNumber, slotId, currentTeamId })
  }

  const handleSeedSelect = async (teamId: string | null) => {
    if (!seedPopover?.slotId) return
    const { slotId } = seedPopover
    ;(document.activeElement as HTMLElement | null)?.blur()
    setSeedPopover(null)
    await seed.assignSlotDirectly(slotId, teamId)
  }

  const onSave = async () => {
    try {
      await handleSave()
      onSaved?.(form.name.trim())
      showToast('トーナメントを保存しました')
    } catch (e) {
      showErrorToast('保存に失敗しました。')
    }
  }

  const onConfirmDelete = async () => {
    setDeleteDialogOpen(false)
    await handleDelete()
    onDeleted?.()
    showToast('トーナメントを削除しました')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          大会
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{competitionName}</Typography>
      </Breadcrumbs>

      {/* トーナメントを編集カード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            トーナメントを編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="トーナメント名*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={!form.name.trim() && dirty}
              helperText={!form.name.trim() && dirty ? 'この項目は必須です' : form.name.length >= 60 ? `${form.name.length}/64文字` : ''}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />

            <SportSelect value={form.sportId || null} onChange={(id) => setSportId(id ?? '')} sports={sports} />

            <SceneSelect value={form.sceneId || null} onChange={(id) => setSceneId(id ?? '')} scenes={scenes} label="タグ" />

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
              メインブラケット設定
            </Typography>

            <TextField
              label="参加チーム数*"
              type="number"
              value={teamCount}
              onChange={handleChange('teamCount')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 2, max: 64, step: 1 } }}
              error={Number(teamCount) < 2 || Number(teamCount) > 64 || !Number.isInteger(Number(teamCount))}
              helperText={Number(teamCount) < 2 || Number(teamCount) > 64 ? '2〜64の範囲で入力してください' : !Number.isInteger(Number(teamCount)) ? '整数を入力してください' : ''}
              sx={CARD_FIELD_SX}
            />

            <TextField
              select
              label="シード配置方法"
              value={placementMethod}
              onChange={handleChange('placementMethod')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            >
              {PLACEMENT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <ProgressionRulesEditor
              enabled={progressionEnabled}
              rankRange={progressionRankRange}
              rules={progressionRules}
              availableTargets={availableProgressionTargets}
              entryCount={entries.length}
              onEnabledChange={setProgressionEnabled}
              onRankRangeChange={setProgressionRankRange}
              onRuleChange={handleProgressionRuleChange}
            />

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
              >
                このトーナメントを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty || !form.name.trim() || Number(teamCount) < 2 || Number(teamCount) > 64 || !Number.isInteger(Number(teamCount))}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>

      {/* ② サブブラケットカード（1つのカードに全サブブラケットをまとめる） */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            サブブラケット
          </Typography>

          {/* サブブラケット追加ボタン/フォーム（一番上） */}
          {showSubCreateInput ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: subBrackets.length > 0 ? 2 : 0 }}>
              <TextField
                label="ブラケット名*"
                size="small"
                placeholder="例: 3位決定戦"
                value={subCreateName}
                onChange={(e) => setSubCreateName(e.target.value)}
                fullWidth
                sx={CARD_FIELD_SX}
                slotProps={{ htmlInput: { maxLength: 64 } }}
                helperText={subCreateName.length >= 60 ? `${subCreateName.length}/64文字` : ''}
              />
              <TextField
                label="参加チーム数*"
                type="number"
                value={subCreateTeamCount}
                onChange={(e) => setSubCreateTeamCount(Number(e.target.value))}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 2, max: 64, step: 1 } }}
                error={subCreateTeamCount < 2 || subCreateTeamCount > 64 || !Number.isInteger(subCreateTeamCount)}
                helperText={subCreateTeamCount < 2 || subCreateTeamCount > 64 ? '2〜64の範囲で入力してください' : ''}
                sx={CARD_FIELD_SX}
              />
              <TextField
                select
                label="シード配置方法"
                value={subCreatePlacement}
                onChange={(e) => setSubCreatePlacement(e.target.value)}
                fullWidth
                size="small"
                sx={CARD_FIELD_SX}
              >
                {PLACEMENT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => { setShowSubCreateInput(false); setSubCreateName(''); setSubCreateTeamCount(4); setSubCreatePlacement('SEED_OPTIMIZED') }}
                  sx={{ ...DELETE_BUTTON_SX, flexShrink: 0, borderColor: '#5B6DC6', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#3949AB' } }}
                >
                  キャンセル
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CheckIcon />}
                  disabled={!subCreateName.trim() || subCreateTeamCount < 2 || subCreateTeamCount > 64 || !Number.isInteger(subCreateTeamCount)}
                  onClick={async () => {
                    await handleCreateSubBracket(subCreateName.trim(), subCreateTeamCount, subCreatePlacement as 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL')
                    setSubCreateName('')
                    setSubCreateTeamCount(4)
                    setSubCreatePlacement('SEED_OPTIMIZED')
                    setShowSubCreateInput(false)
                    showToast('サブブラケットを追加しました')
                  }}
                  sx={SAVE_BUTTON_SX}
                >
                  追加
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setShowSubCreateInput(true)}
              sx={{ ...SAVE_BUTTON_SX, mb: subBrackets.length > 0 ? 2 : 0 }}
            >
              サブブラケットを追加
            </Button>
          )}

          {/* サブブラケット一覧 */}
          {subBrackets.map((sub, subIdx) => {
            const subBracketData = data.brackets.find(b => b.id === sub.id)
            const seedSlotCount = subBracketData?.matches
              .flatMap(m => [m.slot1, m.slot2])
              .filter(s => s.sourceType === 'SEED').length ?? 0
            const serverTeamCount = seedSlotCount || 4
            const serverPlacement = sub.placementMethod ?? 'SEED_OPTIMIZED'
            const edit = subEdits[sub.id] ?? {}
            const currentTeamCount = edit.teamCount ?? serverTeamCount
            const currentPlacement = edit.placement ?? serverPlacement
            const hasChanges = (edit.teamCount != null && edit.teamCount !== serverTeamCount)
              || (edit.placement != null && edit.placement !== serverPlacement)

            return (
              <Box key={sub.id}>
                {subIdx > 0 && <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 2 }} />}
                <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, mb: 2, ...(subIdx > 0 ? { display: 'none' } : {}) }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C' }}>
                    {sub.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <TextField
                    label="ブラケット名"
                    size="small"
                    defaultValue={sub.name}
                    fullWidth
                    sx={CARD_FIELD_SX}
                    slotProps={{ htmlInput: { maxLength: 64 } }}
                    onBlur={(e) => {
                      const newName = e.target.value.trim()
                      if (newName && newName !== sub.name) {
                        handleUpdateSubBracketName(sub.id, newName)
                        showToast('ブラケット名を更新しました')
                      }
                    }}
                  />

                  <TextField
                    label="参加チーム数"
                    type="number"
                    value={currentTeamCount}
                    onChange={(e) => setSubEdits(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], teamCount: Number(e.target.value) } }))}
                    fullWidth
                    size="small"
                    slotProps={{ htmlInput: { min: 2, max: 64, step: 1 } }}
                    error={currentTeamCount < 2 || currentTeamCount > 64 || !Number.isInteger(currentTeamCount)}
                    helperText={currentTeamCount < 2 || currentTeamCount > 64 ? '2〜64の範囲で入力してください' : ''}
                    sx={CARD_FIELD_SX}
                  />

                  <TextField
                    select
                    label="シード配置方法"
                    value={currentPlacement}
                    onChange={(e) => setSubEdits(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], placement: e.target.value } }))}
                    fullWidth
                    size="small"
                    sx={CARD_FIELD_SX}
                  >
                    {PLACEMENT_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                      onClick={() => setSubDeleteTarget({ id: sub.id, name: sub.name })}
                      sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
                    >
                      削除
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CheckIcon />}
                      disabled={!hasChanges || currentTeamCount < 2 || currentTeamCount > 64 || !Number.isInteger(currentTeamCount)}
                      onClick={async () => {
                        await handleRegenerateSubBracket(
                          sub.id,
                          sub.name,
                          currentTeamCount,
                          currentPlacement as 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL',
                        )
                        setSubEdits(prev => { const next = { ...prev }; delete next[sub.id]; return next })
                        showToast('サブブラケットを再生成しました')
                      }}
                      sx={SAVE_BUTTON_SX}
                    >
                      保存
                    </Button>
                  </Box>
                </Box>
              </Box>
            )
          })}

          {subBrackets.length === 0 && !showSubCreateInput && (
            <Typography sx={{ fontSize: '12px', color: '#5B6DC6', opacity: 0.7, mt: 1 }}>
              サブブラケットはまだありません
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* ③ トーナメント表カード */}
      {data.brackets.length > 0 && data.brackets.some(b => b.matches.length > 0) && (
        <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>
              ブラケット構成
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mb: 2 }}>
              試合カードをクリックすると試合詳細画面に移動できます。シードをクリックするとチームを割り当てられます。
            </Typography>
            {[...data.brackets]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((bracket, idx) => (
                <Box key={bracket.id}>
                  {idx > 0 && <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 3 }} />}
                  <TournamentBracketView
                    bracket={bracket}
                    onMatchClick={(match) => navigateToPage('active-matches', {
                      matchId: match.id,
                      from: 'tournament',
                      competitionId: competitionId,
                      competitionName: competitionName,
                    })}
                    onSeedClick={handleSeedClick}
                    onSwapMatches={handleSwapMatches}
                  />
                </Box>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Seed選択ポップオーバー */}
      <Popover
        open={!!seedPopover}
        anchorEl={seedPopover?.anchorEl}
        onClose={() => setSeedPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 200, maxHeight: 300 } } }}
        disableAutoFocus
        disableRestoreFocus
      >
        <MenuList dense>
          <MenuItem onClick={() => handleSeedSelect(null)}>
            <Typography sx={{ fontSize: '13px', color: '#9E9E9E', fontStyle: 'italic' }}>未割当に戻す</Typography>
          </MenuItem>
          {seed.teams.map((team) => {
            const usedSeeds = new Set(
              Object.entries(seed.assignments)
                .filter(([k]) => Number(k) !== seedPopover?.seedNumber)
                .map(([, v]) => v)
                .filter(Boolean),
            )
            return (
              <MenuItem
                key={team.id}
                disabled={usedSeeds.has(team.id)}
                selected={team.id === seedPopover?.currentTeamId}
                onClick={() => handleSeedSelect(team.id)}
              >
                <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{team.name}</Typography>
              </MenuItem>
            )
          })}
        </MenuList>
      </Popover>

      {/* エントリーカード */}
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {data.name}のエントリー
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {['チーム名', 'クラス', ''].map((header, i) => (
                  <TableCell key={i} sx={{ ...CARD_TABLE_HEAD_SX, ...(i === 2 ? { width: 48 } : {}) }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamName}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{entry.teamClass}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, width: 48, p: 0, textAlign: 'center' }}>
                    <DeleteIcon
                      onClick={() => handleDeleteEntry(entry.id)}
                      sx={{ fontSize: 20, color: '#D71212', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {entries.length >= 2 && (
              <Button
                variant="outlined"
                startIcon={<SportsScoreIcon />}
                onClick={() => navigateToPage('active-matches')}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0, borderColor: '#5B6DC6', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#3949AB' }, '& .MuiButton-startIcon': { color: '#5B6DC6' } }}
              >
                試合ページで確認する
              </Button>
            )}
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={SAVE_BUTTON_SX}
            >
              エントリーを追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      <AddEntryDialog
        open={addDialogOpen}
        leagueName={data.name}
        existingTeamNames={entries.map(e => e.teamName)}
        onClose={handleCloseAddDialog}
        onAdd={handleAddEntries}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="トーナメントを削除しますか？"
        description={`「${tournamentName}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />

      <ConfirmDialog
        open={!!subDeleteTarget}
        title="サブブラケットを削除しますか？"
        description={`「${subDeleteTarget?.name ?? ''}」を削除します。この操作は元に戻せません。`}
        onClose={() => setSubDeleteTarget(null)}
        onConfirm={async () => {
          if (subDeleteTarget) {
            await handleDeleteSubBracket(subDeleteTarget.id)
            setSubDeleteTarget(null)
            showToast('サブブラケットを削除しました')
          }
        }}
      />
    </Box>
  )
}
