import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { ActiveMatch } from '../types'
import { useMatchDetails } from '../hooks/useMatchDetails'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

const DETAIL_FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
  },
  '& input, & textarea': { fontSize: '13px', color: '#2F3C8C' },
}

const DETAIL_LABEL_SX = { fontSize: '12px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }

type Props = {
  match: ActiveMatch
}

export function MatchDetailsCard({ match }: Props) {
  const {
    open, setOpen,
    locationId, setLocationId,
    locations,
    startTime, setStartTime,
    handleSave, handleReset,
  } = useMatchDetails(match)

  return (
    <Card sx={{ background: CARD_GRADIENT }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C' }}>
            試合の詳細設定
          </Typography>
          {open && (
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#5B6DC6', '&:hover': { backgroundColor: '#E8EAF6' } }}>
              <ExpandLessIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {/* 編集するトグル（未展開時のみボタン表示） */}
        {!open ? (
          <ButtonBase
            onClick={() => setOpen(true)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid #5B6DC6', borderRadius: 1, px: 1.5, py: 0.75,
              width: '100%', backgroundColor: 'transparent',
              '&:hover': { backgroundColor: '#E8EAF6' },
            }}
          >
            <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: 500 }}>
              編集する
            </Typography>
          </ButtonBase>
        ) : (
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#2F3C8C' }}>
            編集する
          </Typography>
        )}

        {/* 展開コンテンツ */}
        <Collapse in={open} timeout={300}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* 試合の場所 */}
            <Box>
              <Typography sx={{ ...DETAIL_LABEL_SX, mb: 1.5 }}>試合の場所</Typography>
              <FormControl size="small" fullWidth>
                <InputLabel shrink sx={{ fontSize: '13px', color: '#2F3C8C' }}>場所</InputLabel>
                <Select
                  value={locationId}
                  label="場所"
                  notched
                  size="small"
                  fullWidth
                  onChange={(e) => setLocationId(e.target.value)}
                  sx={{
                    backgroundColor: 'transparent',
                    '& fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                    '&:hover fieldset': { borderColor: '#5B6DC6' },
                    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: 1 },
                  }}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{loc.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* 開始時刻 */}
            <TextField
              label="開始時刻"
              type="datetime-local"
              size="small"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{
                ...DETAIL_FIELD_SX,
                '& .MuiInputLabel-root': { color: '#2F3C8C', fontSize: '13px' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C' },
              }}
              InputLabelProps={{ shrink: true }}
            />

            {/* すべて元に戻す / 実行 */}
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon sx={{ color: '#D71212' }} />}
                onClick={handleReset}
                sx={{
                  flex: 3,
                  fontSize: '13px',
                  color: '#D71212',
                  borderColor: '#D71212',
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
                }}
              >
                すべて元に戻す
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleSave}
                sx={{ ...SAVE_BUTTON_SX, flex: 7, fontSize: '13px' }}
              >
                実行
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
