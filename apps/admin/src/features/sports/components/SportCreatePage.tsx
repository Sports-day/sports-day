import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { BackButton } from '@/components/ui/BackButton'
import { useState } from 'react'
import { useSportCreate } from '../hooks/useSportCreate'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX, CARD_FIELD_CREATE_SX } from '@/styles/commonSx'

type Props = {
  onBack: () => void
  onSave: () => void
}

export function SportCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit: handleSubmitOriginal } = useSportCreate(onSave)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    if (!form.name.trim()) return
    handleSubmitOriginal()
    showToast('競技を作成しました')
  }

  return (
    <Box>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          競技作成
        </Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            競技の作成
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              placeholder="名前*"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              size="small"
              error={submitted && !form.name.trim()}
              helperText={submitted && !form.name.trim() ? 'この項目は必須です' : form.name.length >= 60 ? `${form.name.length}/64文字` : ''}
              sx={CARD_FIELD_CREATE_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitted && !form.name.trim()}
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
