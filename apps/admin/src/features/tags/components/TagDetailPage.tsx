import { Box, Breadcrumbs, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useTagDetail } from '../hooks/useTagDetail'
import { CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  tagId: string
  onBack: () => void
}

export function TagDetailPage({ tagId, onBack }: Props) {
  const { name, setName, enabled, setEnabled, handleSave, handleDelete, tagName } = useTagDetail(tagId)

  const onSave = () => {
    handleSave()
    onBack()
  }

  const onDelete = () => {
    handleDelete()
    onBack()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBack}>
          タグ
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tagName}</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          タグ情報
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <TextField
            size="small"
            label="タグ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ ...CARD_FIELD_SX, width: 200 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                size="small"
                sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#5B6DC6' } }}
              />
            }
            label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>有効</Typography>}
            sx={{ ml: 0 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onDelete}
            sx={DELETE_BUTTON_SX}
          >
            このタグを削除
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={onSave}
            sx={SAVE_BUTTON_SX}
          >
            保存
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
