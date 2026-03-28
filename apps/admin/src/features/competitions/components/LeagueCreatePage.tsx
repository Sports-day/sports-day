import { Box, Breadcrumbs, Button, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useLeagueCreate } from '../hooks/useLeagueCreate'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

const FORMAT_OPTIONS = [
  { value: 'league', label: 'リーグ戦' },
  { value: 'tournament', label: 'トーナメント' },
  { value: 'group', label: 'グループステージ' },
]

const SCORING_OPTIONS = [
  { value: 'point', label: '得点制' },
  { value: 'win-point', label: '勝点制' },
  { value: 'time', label: 'タイム制' },
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
  '& .MuiInputLabel-root': { color: '#2F3C8C', opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C' },
}

type Props = {
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
  onSave: () => void
}

export function LeagueCreatePage({ competitionId, competitionName, onBackToList, onBackToDetail, onSave }: Props) {
  const { form, handleChange, handleSubmit } = useLeagueCreate(competitionId, onSave)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToList}
        >
          競技
        </Typography>
        <Typography
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          onClick={onBackToDetail}
        >
          {competitionName}
        </Typography>
        <Typography sx={{ fontSize: '16px', color: '#2F3C8C' }}>
          リーグを作成
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            リーグを作成
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="大会(トーナメント リーグ)名*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              placeholder="説明(任意)"
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              label="重み(0~100)"
              type="number"
              value={form.weight}
              onChange={handleChange('weight')}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              sx={FIELD_SX}
            />

            <TextField
              select
              value={form.format}
              onChange={handleChange('format')}
              fullWidth
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value) return <Typography component="span" sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: 'inherit' }}>大会形式</Typography>
                  const opt = FORMAT_OPTIONS.find(o => o.value === value)
                  return opt ? opt.label : String(value)
                },
              }}
              sx={FIELD_SX}
            >
              {FORMAT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              value={form.scoringFormat}
              onChange={handleChange('scoringFormat')}
              fullWidth
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value) return <Typography component="span" sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: 'inherit' }}>採点形式</Typography>
                  const opt = SCORING_OPTIONS.find(o => o.value === value)
                  return opt ? opt.label : String(value)
                },
              }}
              sx={FIELD_SX}
            >
              {SCORING_OPTIONS.map(opt => (
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
                  if (!value) return <Typography component="span" sx={{ color: '#2F3C8C', opacity: 0.5, fontSize: 'inherit' }}>タグ</Typography>
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
