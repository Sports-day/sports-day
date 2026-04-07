import { Box, Breadcrumbs, Button, ButtonBase, Chip, Typography } from '@mui/material'
import { useImageDetail } from '../hooks/useImageDetail'
import { showToast } from '@/lib/toast'
import { DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  imageId: string
  onBack: () => void
}

export function ImageDetailPage({ imageId, onBack }: Props) {
  const { url, status, handleDelete } = useImageDetail(imageId)

  const onDelete = async () => {
    await handleDelete()
    showToast('画像を削除しました')
    onBack()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          画像
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{imageId}</Typography>
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
                alt={imageId}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.4 }}>プレビューなし</Typography>
            )}
          </Box>

          {/* 情報 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mb: 0.5 }}>ID</Typography>
              <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{imageId}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mb: 0.5 }}>ステータス</Typography>
              <Chip
                label={status}
                size="small"
                sx={{
                  bgcolor: status === 'uploaded' ? '#E8EAF6' : '#F5F5F5',
                  color: status === 'uploaded' ? '#3949AB' : '#9E9E9E',
                  fontSize: '11px',
                  fontWeight: 600,
                  height: 22,
                }}
              />
            </Box>
            {url && (
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mb: 0.5 }}>URL</Typography>
                <Typography sx={{ fontSize: '12px', color: '#2F3C8C', wordBreak: 'break-all' }}>{url}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ width: 160 }}>
          <Button variant="outlined" onClick={onDelete} fullWidth sx={DELETE_BUTTON_SX}>
            削除
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
