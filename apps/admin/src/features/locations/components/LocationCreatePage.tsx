import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useLocationCreate } from '../hooks/useLocationCreate'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX, CARD_FIELD_CREATE_SX } from '@/styles/commonSx'

type Props = {
  onBack: () => void
  onSave: () => void
}

export function LocationCreatePage({ onBack, onSave }: Props) {
  const { form, handleChange, handleSubmit } = useLocationCreate(onSave)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          場所
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
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
              sx={CARD_FIELD_CREATE_SX}
            />

            <TextField
              placeholder="備考*"
              value={form.note}
              onChange={handleChange('note')}
              fullWidth
              size="small"
              sx={CARD_FIELD_CREATE_SX}
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
