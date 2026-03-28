import { Box, Breadcrumbs, Button, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useCompetitionCreate } from '../hooks/useCompetitionCreate'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

const ICON_OPTIONS = [
  { value: 'basketball', label: 'バスケットボール' },
  { value: 'volleyball', label: 'バレーボール' },
  { value: 'soccer', label: 'サッカー' },
  { value: 'tennis', label: 'テニス' },
  { value: 'baseball', label: '野球' },
]

const TAG_OPTIONS = [
  { value: 'sunny', label: '晴天時' },
  { value: 'rainy', label: '雨天時' },
  { value: 'indoor', label: '室内' },
  { value: 'outdoor', label: '屋外' },
]

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  },
  '& input::placeholder': { color: '#2F3C8C', opacity: 0.5 },
  '& .MuiFormHelperText-root': { color: '#2F3C8C', opacity: 0.6, ml: 0 },
}

type Props = {
  onBack: () => void
  onSave: (name: string) => void
}

export function CompetitionCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit } = useCompetitionCreate(onSave)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 1 }}>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBack}
        >
          競技
        </Typography>
        <Typography sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          競技を新規作成
        </Typography>
      </Breadcrumbs>

      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        競技を新規作成
      </Typography>

      <Card sx={{ background: CARD_GRADIENT, border: '1px solid #5B6DC6' }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            競技の情報
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="競技名"
              helperText="例: バスケットボール晴天時"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              placeholder="競技の説明"
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              select
              value={form.icon}
              onChange={handleChange('icon')}
              fullWidth
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value) return <Box component="span" sx={{ color: '#2F3C8C', opacity: 0.5 }}>アイコン</Box>
                  const opt = ICON_OPTIONS.find(o => o.value === value)
                  return opt ? opt.label : String(value)
                },
              }}
              sx={FIELD_SX}
            >
              {ICON_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              value={form.tag}
              onChange={handleChange('tag')}
              fullWidth
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value) return <Box component="span" sx={{ color: '#2F3C8C', opacity: 0.5 }}>タグ</Box>
                  const opt = TAG_OPTIONS.find(o => o.value === value)
                  return opt ? opt.label : String(value)
                },
              }}
              sx={FIELD_SX}
            >
              {TAG_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckIcon />}
              onClick={handleSubmit}
              sx={{ ...SAVE_BUTTON_SX, fontSize: '14px', '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
            >
              保存
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
