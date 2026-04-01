import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { showToast } from '@/lib/toast'
import { useCompetitionCreate } from '../hooks/useCompetitionCreate'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX, CARD_FIELD_CREATE_SX } from '@/styles/commonSx'
import { ICON_OPTIONS, TAG_OPTIONS } from '../constants'

const FIELD_SX = { ...CARD_FIELD_CREATE_SX, '& .MuiFormHelperText-root': { color: '#2F3C8C', opacity: 0.6, ml: 0 } }

type Props = {
  onBack: () => void
  onSave: (name: string) => void
}

export function CompetitionCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit } = useCompetitionCreate(onSave)
  const [submitted, setSubmitted] = useState(false)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 1 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          競技を新規作成
        </Typography>
      </Breadcrumbs>

      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        競技を新規作成
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            競技の情報
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="競技名"
              helperText={submitted && !form.name.trim() ? 'この項目は必須です' : '例: バスケットボール晴天時'}
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={submitted && !form.name.trim()}
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
              disabled={submitted && !form.name.trim()}
              onClick={() => { setSubmitted(true); if (!form.name.trim()) return; handleSubmit(); showToast('競技を作成しました') }}
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
