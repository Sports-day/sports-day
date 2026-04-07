import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import {
  BREADCRUMB_CURRENT_SX,
  BREADCRUMB_LINK_SX,
  CARD_FIELD_SX,
  CARD_GRADIENT,
  DELETE_BUTTON_SX,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useTournamentDetail } from '../hooks/useTournamentDetail'
import { useTournamentEdit } from '../hooks/useTournamentEdit'
import { useSeedAssignment } from '@/hooks/useSeedAssignment'

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
  tournamentId,
  tournamentName,
  competitionId: _competitionId,
  competitionName: _competitionName,
  onBackToList,
  onBackToDetail: _onBackToDetail,
  onSaved,
  onDeleted,
}: Props) {
  const data = useTournamentDetail(tournamentId, tournamentName)

  const {
    name,
    teamCount,
    placementMethod,
    handleChange,
    dirty,
    handleSave,
    handleDelete,
  } = useTournamentEdit(tournamentId)

  const { seedNumbers, assignments, teams, setAssignment, saveAssignments } = useSeedAssignment(tournamentId)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = async () => {
    await handleSave()
    onSaved?.(name.trim())
    showToast('トーナメントを保存しました')
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
        <Typography sx={BREADCRUMB_CURRENT_SX}>{data.name}</Typography>
      </Breadcrumbs>

      {/* トーナメントを編集カード */}
      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            トーナメントを編集
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="トーナメント名*"
              value={name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />

            <TextField
              label="参加チーム数*"
              type="number"
              value={teamCount}
              onChange={handleChange('teamCount')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 2, max: 64 } }}
              helperText="本戦と順位決定戦（3位決定戦等）が自動生成されます"
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

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3 }} />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                disabled={!dirty || !name.trim()}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* シード割り当てカード */}
      {seedNumbers.length > 0 && (
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmojiEventsIcon sx={{ fontSize: 18, color: '#2F3C8C' }} />
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
                シード割り当て
              </Typography>
              <Chip
                label={`${teamCount}チーム`}
                size="small"
                sx={{ bgcolor: '#E8EAF6', color: '#3949AB', fontWeight: 700, fontSize: '11px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {seedNumbers.map((seedNumber) => {
                const usedTeamIds = new Set(
                  Object.entries(assignments)
                    .filter(([k]) => Number(k) !== seedNumber)
                    .map(([, v]) => v)
                    .filter(Boolean),
                )
                return (
                  <Box key={seedNumber} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={`Seed ${seedNumber}`}
                      size="small"
                      sx={{ minWidth: 64, bgcolor: '#E8EAF6', color: '#3949AB', fontWeight: 700, fontSize: '12px' }}
                    />
                    <TextField
                      select
                      size="small"
                      value={assignments[seedNumber] ?? ''}
                      onChange={(e) => setAssignment(seedNumber, e.target.value)}
                      sx={{ flex: 1, maxWidth: 280, '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' } }}
                      slotProps={{ select: { displayEmpty: true } }}
                    >
                      <MenuItem value=""><em style={{ color: '#9E9E9E' }}>未割当</em></MenuItem>
                      {teams.map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.id}
                          disabled={usedTeamIds.has(team.id)}
                        >
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )
              })}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={() => { saveAssignments(); showToast('シード割り当てを保存しました') }}
                sx={SAVE_BUTTON_SX}
              >
                割り当てを保存
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="トーナメントを削除しますか？"
        description={`「${tournamentName}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
