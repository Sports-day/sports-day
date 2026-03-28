import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { ActiveMatch, ActiveTeam } from '../types'
import { SAVE_BUTTON_SX } from '@/styles/commonSx'

const STATUS_OPTIONS: { value: ActiveMatch['status']; label: string }[] = [
  { value: 'standby', label: '未登録' },
  { value: 'ongoing', label: '進行中' },
  { value: 'finished', label: '終了' },
]

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#2F3C8C' },
    '&.Mui-focused fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
  },
  '& input': { fontSize: '13px', color: '#2F3C8C', textAlign: 'center' },
}

type Props = {
  open: boolean
  match: ActiveMatch | null
  teamA: ActiveTeam | null
  teamB: ActiveTeam | null
  leagueName: string
  scoreA: string
  scoreB: string
  status: ActiveMatch['status']
  onScoreAChange: (v: string) => void
  onScoreBChange: (v: string) => void
  onStatusChange: (v: ActiveMatch['status']) => void
  onClose: () => void
  onSave: () => void
}

export function MatchEditDialog({
  open,
  match,
  teamA,
  teamB,
  leagueName,
  scoreA,
  scoreB,
  status,
  onScoreAChange,
  onScoreBChange,
  onStatusChange,
  onClose,
  onSave,
}: Props) {
  if (!match || !teamA || !teamB) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, backgroundColor: '#EFF0F8', p: 0.5 },
      }}
    >
      <DialogTitle sx={{ fontSize: '15px', fontWeight: 700, color: '#2F3C8C', pb: 1 }}>
        {leagueName} 試合編集
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        {/* チーム & スコア */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* 左チーム */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: '#3949AB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>左</Typography>
            </Box>
            <Box sx={{ backgroundColor: '#D5D9EF', borderRadius: 1, px: 1.5, py: 0.5, width: '100%', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 600 }}>
                {teamA.name}
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="0"
              value={scoreA}
              onChange={(e) => onScoreAChange(e.target.value)}
              inputProps={{ type: 'number', min: 0 }}
              sx={{ ...FIELD_SX, width: '80px' }}
            />
          </Box>

          {/* VS */}
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C', flexShrink: 0 }}>vs</Typography>

          {/* 右チーム */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: '#C0C6E9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '11px', color: '#2F3C8C', fontWeight: 700 }}>右</Typography>
            </Box>
            <Box sx={{ backgroundColor: '#D5D9EF', borderRadius: 1, px: 1.5, py: 0.5, width: '100%', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 600 }}>
                {teamB.name}
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="0"
              value={scoreB}
              onChange={(e) => onScoreBChange(e.target.value)}
              inputProps={{ type: 'number', min: 0 }}
              sx={{ ...FIELD_SX, width: '80px' }}
            />
          </Box>
        </Box>

        {/* ステータス */}
        <Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
            ステータス
          </Typography>
          <FormControl size="small" sx={{ width: '50%' }}>
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as ActiveMatch['status'])}
              sx={{
                fontSize: '13px',
                color: '#2F3C8C',
                backgroundColor: 'transparent',
                '& fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
                '&:hover fieldset': { borderColor: '#2F3C8C' },
                '&.Mui-focused fieldset': { borderColor: '#2F3C8C', borderWidth: 1 },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{opt.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 時刻 */}
        <Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
            開催時刻
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#5F6DC2' }}>
            {match.time ?? '未設定'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6' } }}
        >
          キャンセル
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}
