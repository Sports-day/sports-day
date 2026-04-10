import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import GroupIcon from '@mui/icons-material/Group'
import SportsIcon from '@mui/icons-material/Sports'
import PersonIcon from '@mui/icons-material/Person'
import GavelIcon from '@mui/icons-material/Gavel'
import type { ActiveMatch } from '../types'
import { useMatchDetails } from '../hooks/useMatchDetails'
import type { JudgeType, JudgeOption } from '../hooks/useMatchDetails'
import {
  useGetAdminTournamentsQuery,
  useGetAdminTournamentQuery,
  useUpdateAdminSlotConnectionMutation,
  useAssignAdminSeedTeamMutation,
  SlotSourceType,
} from '@/gql/__generated__/graphql'
import { CARD_GRADIENT, CARD_FIELD_SX, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'

// ─── 審判タイプ設定 ───────────────────────────────────────
const JUDGE_TYPES: { value: JudgeType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'group', label: 'クラス', icon: <GroupIcon sx={{ fontSize: 16 }} />, color: '#7E57C2' },
  { value: 'team',  label: 'チーム', icon: <SportsIcon sx={{ fontSize: 16 }} />, color: '#1976D2' },
  { value: 'user',  label: 'ユーザー', icon: <PersonIcon sx={{ fontSize: 16 }} />, color: '#2E7D32' },
]

type Props = {
  match: ActiveMatch
  open: boolean
  onClose: () => void
  competitionId?: string
  competitionType?: string
}

export function MatchDetailsCard({ match, open, onClose, competitionId, competitionType }: Props) {
  const {
    locationId, setLocationId,
    locations,
    time, setTime,
    judgmentType, setJudgmentType,
    judgmentTargetId, setJudgmentTargetId,
    optionsByType,
    currentJudgmentLabel,
    handleSave, handleReset,
  } = useMatchDetails(match, competitionId)

  // ─── トーナメント進出先設定 ──────────────────────────
  const isTournament = competitionType === 'TOURNAMENT'
  const { data: tournamentsData } = useGetAdminTournamentsQuery({
    variables: { competitionId: competitionId ?? '' },
    skip: !isTournament || !competitionId,
    fetchPolicy: 'cache-and-network',
  })
  const subBrackets = (tournamentsData?.tournaments ?? []).filter(t => t.bracketType === 'SUB')

  const fetchOpts = { fetchPolicy: 'cache-and-network' as const }
  const sub0 = useGetAdminTournamentQuery({ variables: { id: subBrackets[0]?.id ?? '' }, skip: !subBrackets[0], ...fetchOpts })
  const sub1 = useGetAdminTournamentQuery({ variables: { id: subBrackets[1]?.id ?? '' }, skip: !subBrackets[1], ...fetchOpts })
  const sub2 = useGetAdminTournamentQuery({ variables: { id: subBrackets[2]?.id ?? '' }, skip: !subBrackets[2], ...fetchOpts })
  const sub3 = useGetAdminTournamentQuery({ variables: { id: subBrackets[3]?.id ?? '' }, skip: !subBrackets[3], ...fetchOpts })
  const sub4 = useGetAdminTournamentQuery({ variables: { id: subBrackets[4]?.id ?? '' }, skip: !subBrackets[4], ...fetchOpts })
  const subQueries = [sub0, sub1, sub2, sub3, sub4]
  const maxSub = 5

  type SlotConnection = { slotId: string; bracketName: string; bracketId: string; role: 'MATCH_WINNER' | 'MATCH_LOSER' }
  const currentConnections: SlotConnection[] = []
  for (let i = 0; i < subBrackets.length && i < maxSub; i++) {
    const subData = subQueries[i]?.data?.tournament
    if (!subData) continue
    for (const slot of subData.slots) {
      if (slot.sourceMatch?.id === match.id) {
        currentConnections.push({ slotId: slot.id, bracketName: subData.name, bracketId: subData.id, role: slot.sourceType as 'MATCH_WINNER' | 'MATCH_LOSER' })
      }
    }
  }
  const winnerConnection = currentConnections.find(c => c.role === 'MATCH_WINNER')
  const loserConnection  = currentConnections.find(c => c.role === 'MATCH_LOSER')

  type SlotOption = { slotId: string; bracketName: string; bracketId: string; label: string }
  const allSlots: SlotOption[] = []
  for (let i = 0; i < subBrackets.length && i < maxSub; i++) {
    const subData = subQueries[i]?.data?.tournament
    if (!subData) continue
    for (const slot of subData.slots) {
      if (slot.sourceType === 'SEED' || slot.sourceMatch?.id === match.id) {
        const teamName = slot.matchEntry?.team?.name
        const seedLabel = slot.seedNumber != null ? `Seed ${slot.seedNumber}` : 'スロット'
        const label = teamName
          ? `${subData.name} — ${seedLabel} (${teamName})`
          : `${subData.name} — ${seedLabel}`
        allSlots.push({ slotId: slot.id, bracketName: subData.name, bracketId: subData.id, label })
      }
    }
  }
  // 勝者/敗者で相手方が既に使っているスロットを除外
  const winnerSlots = allSlots.filter(s => s.slotId !== loserConnection?.slotId)
  const loserSlots = allSlots.filter(s => s.slotId !== winnerConnection?.slotId)

  const [updateSlotConnection] = useUpdateAdminSlotConnectionMutation({ refetchQueries: [] })
  const [assignSeedTeam] = useAssignAdminSeedTeamMutation({ refetchQueries: [] })

  // updateSlotConnection はバックエンドで clearSeedTeamsIfReady を呼び、
  // READY状態（全SEEDにチーム割当済）のブラケットの全SEEDチーム割当をクリアする。
  // TournamentDetailPage の handleSwapMatches と同様に、変更前に保存→変更後に復元する。
  const handleSlotSourceChange = async (role: 'MATCH_WINNER' | 'MATCH_LOSER', targetSlotId: string) => {
    const existing = role === 'MATCH_WINNER' ? winnerConnection : loserConnection

    // 影響を受けるブラケットのSEED割り当てを保存
    const affectedBracketIds = new Set<string>()
    if (existing) affectedBracketIds.add(existing.bracketId)
    if (targetSlotId) {
      const target = allSlots.find(s => s.slotId === targetSlotId)
      if (target) affectedBracketIds.add(target.bracketId)
    }
    const savedSeeds: { slotId: string; teamId: string }[] = []
    for (const bracketId of affectedBracketIds) {
      const subIdx = subBrackets.findIndex(b => b.id === bracketId)
      if (subIdx === -1 || subIdx >= maxSub) continue
      const subData = subQueries[subIdx]?.data?.tournament
      if (!subData) continue
      for (const slot of subData.slots) {
        // 変更対象のスロット以外でSEEDかつチーム割当済みのものを保存
        if (slot.sourceType === 'SEED' && slot.matchEntry?.team?.id
            && slot.id !== targetSlotId && slot.id !== existing?.slotId) {
          savedSeeds.push({ slotId: slot.id, teamId: slot.matchEntry.team.id })
        }
      }
    }

    // スロット接続を変更
    if (existing && existing.slotId !== targetSlotId) {
      await updateSlotConnection({ variables: { input: { slotId: existing.slotId, sourceType: SlotSourceType.Seed, sourceMatchId: null, seedNumber: null } } })
    }
    if (targetSlotId !== '') {
      await updateSlotConnection({
        variables: {
          input: {
            slotId: targetSlotId,
            sourceType: role === 'MATCH_WINNER' ? SlotSourceType.MatchWinner : SlotSourceType.MatchLoser,
            sourceMatchId: match.id,
            seedNumber: null,
          },
        },
      })
    }

    // clearSeedTeamsIfReady でクリアされた可能性のあるSEED割り当てを復元
    for (const { slotId, teamId } of savedSeeds) {
      try { await assignSeedTeam({ variables: { input: { slotId, teamId } } }) } catch { /* 続行 */ }
    }

    // 全ての変更完了後にまとめてrefetch
    await Promise.all(
      subQueries.filter((_, i) => i < subBrackets.length).map(q => q.refetch()),
    )

    showToast(targetSlotId === '' && existing ? '進出先を解除しました' : '進出先を設定しました')
  }

  const onSave = async () => { await handleSave(); onClose() }
  const onCancel = () => { handleReset(); onClose() }

  // 審判セレクト用のオプション（選択中のタイプに応じて切替）
  const judgeSelectOptions: JudgeOption[] = judgmentType ? (optionsByType[judgmentType] ?? []) : []
  const selectedJudgeOption = judgeSelectOptions.find(o => o.id === judgmentTargetId) ?? null

  return (
    <Collapse in={open} timeout={200}>
      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            試合の詳細設定
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 場所 */}
            <FormControl size="small" fullWidth>
              <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>場所</InputLabel>
              <Select
                value={locationId}
                label="場所"
                notched
                size="small"
                fullWidth
                onChange={(e) => setLocationId(e.target.value)}
                sx={{ ...CARD_FIELD_SX['& .MuiOutlinedInput-root'] }}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{loc.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 開始時刻 */}
            <TextField
              label="開始時刻"
              type="datetime-local"
              size="small"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              sx={CARD_FIELD_SX}
              InputLabelProps={{ shrink: true }}
            />

            {/* ─── 審判セクション ─── */}
            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <GavelIcon sx={{ fontSize: 16, color: '#5B6DC6' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
                審判
              </Typography>
              {currentJudgmentLabel && (
                <Chip
                  label={currentJudgmentLabel}
                  size="small"
                  sx={{
                    ml: 'auto',
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: '#E8EAF6',
                    color: '#3949AB',
                    border: '1px solid #C5CAE9',
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              )}
            </Box>

            {/* タイプ選択トグルボタン */}
            <Box
              sx={{
                display: 'flex',
                border: '1px solid #5B6DC6',
                borderRadius: 1.5,
                overflow: 'hidden',
                backgroundColor: '#E8EAF6',
              }}
            >
              {JUDGE_TYPES.map((type, i) => {
                const isActive = judgmentType === type.value
                return (
                  <ButtonBase
                    key={type.value}
                    onClick={() => {
                      if (judgmentType === type.value) {
                        setJudgmentType(null)
                        setJudgmentTargetId('')
                      } else {
                        setJudgmentType(type.value)
                        setJudgmentTargetId('')
                      }
                    }}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      py: 0.9,
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? type.color : '#5B6DC6',
                      backgroundColor: isActive ? '#fff' : 'transparent',
                      borderRight: i < JUDGE_TYPES.length - 1 ? '1px solid #C5CAE9' : 'none',
                      boxShadow: isActive ? '0 1px 4px rgba(57,73,171,0.15)' : 'none',
                      transition: 'all 0.15s',
                      '&:hover': {
                        backgroundColor: isActive ? '#fff' : '#DCE0F5',
                      },
                    }}
                  >
                    {type.icon}
                    {type.label}
                  </ButtonBase>
                )
              })}
            </Box>

            {/* 審判候補セレクト */}
            {judgmentType && (
              <Autocomplete
                size="small"
                options={judgeSelectOptions}
                getOptionLabel={(o) => o.name}
                value={selectedJudgeOption}
                onChange={(_, newVal) => setJudgmentTargetId(newVal?.id ?? '')}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                noOptionsText={
                  judgeSelectOptions.length === 0
                    ? 'エントリーがありません'
                    : '一致する候補がありません'
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      judgmentType === 'group' ? 'クラスを選択'
                      : judgmentType === 'team' ? 'チームを選択'
                      : 'ユーザーを選択'
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={CARD_FIELD_SX}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: string }
                  return (
                    <li key={key} {...rest}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.3 }}>
                        <Box
                          sx={{
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor:
                              judgmentType === 'group' ? '#7E57C2'
                              : judgmentType === 'team' ? '#1976D2'
                              : '#2E7D32',
                            flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{option.name}</Typography>
                      </Box>
                    </li>
                  )
                }}
                sx={{
                  '& .MuiAutocomplete-endAdornment': { color: '#5B6DC6' },
                }}
                ListboxProps={{ sx: { maxHeight: 220 } }}
              />
            )}

            {!judgmentType && !currentJudgmentLabel && (
              <Typography sx={{ fontSize: '12px', color: '#9E9E9E', fontStyle: 'italic', textAlign: 'center', py: 0.5 }}>
                上のボタンから審判の種類を選択してください
              </Typography>
            )}

            {/* トーナメント進出先設定 */}
            {isTournament && subBrackets.length > 0 && (
              <>
                <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 0.5 }} />
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
                  進出先設定
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#5B6DC6', mb: 0.5 }}>
                  この試合の勝者・敗者をサブブラケットのスロットに送ります
                </Typography>
                {allSlots.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControl size="small" fullWidth>
                      <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>勝者の進出先</InputLabel>
                      <Select
                        value={winnerConnection?.slotId ?? ''}
                        label="勝者の進出先"
                        notched
                        size="small"
                        onChange={(e) => handleSlotSourceChange('MATCH_WINNER', e.target.value)}
                        sx={{ ...CARD_FIELD_SX['& .MuiOutlinedInput-root'] }}
                      >
                        <MenuItem value=""><Typography sx={{ fontSize: '13px', color: '#9E9E9E' }}>なし</Typography></MenuItem>
                        {winnerSlots.map(s => (
                          <MenuItem key={`w-${s.slotId}`} value={s.slotId}>
                            <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{s.label}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>敗者の進出先</InputLabel>
                      <Select
                        value={loserConnection?.slotId ?? ''}
                        label="敗者の進出先"
                        notched
                        size="small"
                        onChange={(e) => handleSlotSourceChange('MATCH_LOSER', e.target.value)}
                        sx={{ ...CARD_FIELD_SX['& .MuiOutlinedInput-root'] }}
                      >
                        <MenuItem value=""><Typography sx={{ fontSize: '13px', color: '#9E9E9E' }}>なし</Typography></MenuItem>
                        {loserSlots.map(s => (
                          <MenuItem key={`l-${s.slotId}`} value={s.slotId}>
                            <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{s.label}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: '12px', color: '#5B6DC6', opacity: 0.7 }}>
                    サブブラケットにスロットがありません。サブブラケットを削除して再作成してください。
                  </Typography>
                )}
              </>
            )}

            {/* 保存 / キャンセル */}
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  flexShrink: 0,
                  fontSize: '13px',
                  color: '#D71212',
                  borderColor: '#D71212',
                  backgroundColor: 'transparent',
                  height: '40px',
                  '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
                }}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Collapse>
  )
}
