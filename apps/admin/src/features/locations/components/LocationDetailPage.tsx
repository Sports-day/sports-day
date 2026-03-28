import { Box, Breadcrumbs, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useLocationDetail } from '../hooks/useLocationDetail'
import type { Location } from '../types'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '../../../styles/commonSx'

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
  },
  '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '14px' },
  '& .MuiInputLabel-root': { color: '#2F3C8C', opacity: 0.7 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2F3C8C', opacity: 1 },
  '& .MuiInputLabel-shrink': { opacity: 1 },
}

type Props = {
  location: Location
  onBack: () => void
  onSave: () => void
  onDelete: () => void
}

export function LocationDetailPage({ location, onBack, onSave, onDelete }: Props) {
  const { name, note, setName, setNote, handleSave, handleDelete } = useLocationDetail(location, onSave, onDelete)

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBack}>
          場所
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {location.name}
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            場所の編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="名称*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <TextField
              label="備考*"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              size="small"
              sx={FIELD_SX}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={handleDelete}
                sx={DELETE_BUTTON_SX}
              >
                この場所を削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={handleSave}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
