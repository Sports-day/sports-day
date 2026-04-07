import { Box, Breadcrumbs, ButtonBase, Button, Typography } from '@mui/material'
import { useImageCreate } from '../hooks/useImageCreate'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onBack: () => void
}

export function ImageCreatePage({ onBack }: Props) {
  const { file, fileInputRef, handleFileSelect, handleCreate, uploading, error } = useImageCreate(() => {
    showToast('画像をアップロードしました')
    onBack()
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null)
  }

  const onCreate = async () => {
    if (!file) return
    await handleCreate()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          画像
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>画像アップロード</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          画像アップロード
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' },
            }}
          >
            ファイルを選択
          </Button>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            {file ? file.name : '選択されていません'}
          </Typography>
        </Box>

        {error && (
          <Typography sx={{ fontSize: '13px', color: '#D71212', mb: 1 }}>
            {error.message}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={!file || uploading}
            onClick={onCreate}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
          >
            {uploading ? 'アップロード中...' : 'アップロード'}
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={uploading}
            sx={{ color: '#2F3C8C', borderColor: '#5B6DC6', height: '40px', fontSize: '13px', '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' } }}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
