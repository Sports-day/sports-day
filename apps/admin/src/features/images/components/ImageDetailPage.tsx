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

        <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'flex-start' }}>
          {/* プレビュー */}
          <Box
            sx={{
              width: 160,
              height: 160,
              borderRadius: 2,
              border: '1px solid #D6D6D6',
              backgroundColor: '#EFF0F8',
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {url ? (
              <Box
                component="img"
                src={url}
                alt={name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const label = document.createElement('span')
                    label.textContent = 'プレビューなし'
                    label.style.cssText = 'font-size:12px;color:#2F3C8C;opacity:0.4;text-align:center;padding:8px'
                    parent.appendChild(label)
                  }
                }}
              />
            ) : (
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.4 }}>プレビューなし</Typography>
            )}
          </Box>

          {/* フォーム */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
            <TextField
              size="small"
              label="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={CARD_FIELD_SX}
            />
            <TextField
              size="small"
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              sx={CARD_FIELD_SX}
            />
          </Box>
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
