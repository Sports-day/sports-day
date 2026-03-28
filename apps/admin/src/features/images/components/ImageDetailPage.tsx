import { Box, Breadcrumbs, Button, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useImageDetail } from '../hooks/useImageDetail'
import { CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  imageId: string
  onBack: () => void
}

export function ImageDetailPage({ imageId, onBack }: Props) {
  const { name, setName, url, setUrl, handleSave, handleDelete, imageName } = useImageDetail(imageId)

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
          画像
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{imageName}</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          画像情報
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <TextField
            size="small"
            label="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ ...CARD_FIELD_SX, width: 300 }}
          />
          <TextField
            size="small"
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ ...CARD_FIELD_SX, width: 400 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onDelete} sx={DELETE_BUTTON_SX}>
            この画像を削除
          </Button>
          <Button variant="contained" fullWidth startIcon={<CheckIcon />} onClick={onSave} sx={SAVE_BUTTON_SX}>
            保存
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
