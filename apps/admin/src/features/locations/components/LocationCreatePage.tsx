import { Box, Breadcrumbs, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useLocationCreate } from '../hooks/useLocationCreate'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  },
  '& input::placeholder': { color: '#2F3C8C', opacity: 0.5 },
}

type Props = {
  onBack: () => void
  onSave: () => void
}

export function LocationCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit } = useLocationCreate(onSave)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBack}
        >
          場所
        </Typography>
        <Typography sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          場所作成
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            場所の作成
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="名前*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              placeholder="備考*"
              value={form.note}
              onChange={handleChange('note')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ ...SAVE_BUTTON_SX, px: 3 }}
              >
                作成
              </Button>
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{
                  borderColor: '#5B6DC6',
                  color: '#2F3C8C',
                  height: '40px',
                  px: 3,
                  '&:hover': { backgroundColor: '#E0E3F5', borderColor: '#5B6DC6' },
                }}
              >
                キャンセル
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
