import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import {
  BREADCRUMB_LINK_SX,
  BREADCRUMB_CURRENT_SX,
  CARD_GRADIENT,
  CARD_FIELD_SX,
  DELETE_BUTTON_SX,
  SAVE_BUTTON_SX,
} from '@/styles/commonSx'
import { TAG_OPTIONS } from '../constants'
import { MOCK_TOURNAMENTS_BY_COMPETITION } from '../mock'
import { useTournamentEdit } from '../hooks/useTournamentEdit'
import { useState } from 'react'

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
  onDeleted: () => void
}

export function TournamentEditPage({
  tournamentId,
  tournamentName,
  competitionId,
  competitionName,
  onBackToList,
  onBackToDetail,
  onDeleted,
}: Props) {
  const {
    name,
    description,
    teamCount,
    hasThirdPlace,
    hasFifthPlace,
    placementMethod,
    tag,
    handleChange,
    handleToggle,
    handleSave,
  } = useTournamentEdit(tournamentId, competitionId)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onSave = () => {
    handleSave()
    onBackToDetail()
  }

  const handleConfirmDelete = () => {
    const list = MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? []
    MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] = list.filter((t) => t.id !== tournamentId)
    onDeleted()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBackToList}>
          競技
        </Typography>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBackToDetail}>
          {competitionName}
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tournamentName}</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmojiEventsIcon sx={{ color: '#2F3C8C', fontSize: 20 }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              {tournamentName}を編集
            </Typography>
          </Box>

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
              label="説明（任意）"
              value={description}
              onChange={handleChange('description')}
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
              helperText="ブラケットの構造が自動生成されます"
              sx={CARD_FIELD_SX}
            />

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 1.5,
                px: 2,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', fontWeight: 600, mb: 0.5 }}>
                サブブラケット（自動生成）
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasThirdPlace}
                    onChange={() => handleToggle('hasThirdPlace')}
                    size="small"
                    sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    3位決定戦を追加
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasFifthPlace}
                    onChange={() => handleToggle('hasFifthPlace')}
                    size="small"
                    sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
                    5〜8位決定戦を追加
                  </Typography>
                }
              />
            </Box>

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

            <TextField
              select
              label="タグ"
              value={tag}
              onChange={handleChange('tag')}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            >
              {TAG_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={DELETE_BUTTON_SX}
              >
                このトーナメントを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                sx={{ ...SAVE_BUTTON_SX, '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          トーナメントを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            「{tournamentName}」を削除します。この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6' } }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="outlined"
            sx={{
              fontSize: '13px',
              color: '#D71212',
              borderColor: '#D71212',
              '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
