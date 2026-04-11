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
import type { TournamentMatchView } from '@/features/competitions/types'
import { SAVE_BUTTON_SX } from '@/styles/commonSx'

const STATUS_OPTIONS: { value: TournamentMatchView['status']; label: string }[] = [
  { value: 'STANDBY', label: '未登録' },
  { value: 'ONGOING', label: '進行中' },
  { value: 'FINISHED', label: '終了' },
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
  match: TournamentMatchView | null
  tournamentName: string
  score1: string
  score2: string
  status: TournamentMatchView['status']
  onScore1Change: (v: string) => void
  onScore2Change: (v: string) => void
  onStatusChange: (v: TournamentMatchView['status']) => void
  onClose: () => void
  onSave: () => void
}

export function TournamentMatchEditDialog({
  open,
  match,
  tournamentName,
  score1,
  score2,
  status,
  onScore1Change,
  onScore2Change,
  onStatusChange,
  onClose,
  onSave,
}: Props) {
  if (!match) return null

  const label1 = match.slot1.teamName ?? (match.slot1.seedNumber != null ? `Seed ${match.slot1.seedNumber}` : '未定')
  const label2 = match.slot2.teamName ?? (match.slot2.seedNumber != null ? `Seed ${match.slot2.seedNumber}` : '未定')

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
        {tournamentName} — {match.label ?? '試合'}編集
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 600 }}>{label1}</Typography>
            </Box>
            <TextField
              size="small"
              placeholder="0"
              value={score1}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || (/^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 999)) onScore1Change(v)
              }}
              error={score1 !== '' && (Number(score1) < 0 || !Number.isInteger(Number(score1)))}
              inputProps={{ type: 'number', min: 0, step: 1 }}
              sx={{ ...FIELD_SX, width: '80px' }}
            />
          </Box>

          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#2F3C8C', flexShrink: 0 }}>vs</Typography>

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
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 600 }}>{label2}</Typography>
            </Box>
            <TextField
              size="small"
              placeholder="0"
              value={score2}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || (/^\d+$/.test(v) && Number(v) >= 0 && Number(v) <= 999)) onScore2Change(v)
              }}
              error={score2 !== '' && (Number(score2) < 0 || !Number.isInteger(Number(score2)))}
              inputProps={{ type: 'number', min: 0, step: 1 }}
              sx={{ ...FIELD_SX, width: '80px' }}
            />
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
            ステータス
          </Typography>
          <FormControl size="small" sx={{ width: '50%' }}>
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as TournamentMatchView['status'])}
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
