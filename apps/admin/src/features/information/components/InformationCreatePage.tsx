import { Box, Breadcrumbs, ButtonBase, Button, MenuItem, TextField, Typography } from '@mui/material'
import { BackButton } from '@/components/ui/BackButton'
import { useState } from 'react'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { useInformationCreate } from '../hooks/useInformationCreate'
import { showToast } from '@/lib/toast'

const INPUT_SX = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'transparent',
    '& fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#5B6DC6' },
    '&.Mui-focused fieldset': { borderColor: '#5B6DC6', borderWidth: '1px' },
  },
  '& .MuiInputBase-input': { color: '#2F3C8C', fontSize: '13px' },
  '& .MuiInputLabel-root': { color: '#5B6DC6', fontSize: '13px' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#5B6DC6' },
}

type Props = {
  onBack: () => void
}

export function InformationCreatePage({ onBack }: Props) {
  const { title, setTitle, content, setContent, status, setStatus, handleCreate } = useInformationCreate(onBack)
  const [submitted, setSubmitted] = useState(false)

  const onCreate = async () => {
    setSubmitted(true)
    if (!title.trim() || !content.trim()) return
    try {
      await handleCreate()
      showToast('お知らせを作成しました')
    } catch {
      // エラートーストはhook側で表示済み
    }
  }

  return (
    <Box>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          お知らせ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>お知らせ作成</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          お知らせ作成
        </Typography>

        <TextField fullWidth size="small" label="タイトル*" value={title} onChange={(e) => setTitle(e.target.value)} error={submitted && !title.trim()} helperText={submitted && !title.trim() ? 'この項目は必須です' : title.length >= 60 ? `${title.length}/64文字` : ''} sx={INPUT_SX} slotProps={{ htmlInput: { maxLength: 64 } }} />
        <TextField fullWidth size="small" label="内容*" value={content} onChange={(e) => setContent(e.target.value)} error={submitted && !content.trim()} helperText={submitted && !content.trim() ? 'この項目は必須です' : `${content.length}/1000文字`} sx={INPUT_SX} multiline rows={4} slotProps={{ htmlInput: { maxLength: 1000 } }} />

        <TextField
          fullWidth
          size="small"
          label="ステータス"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
          select
          sx={INPUT_SX}
        >
          <MenuItem value="draft">下書き</MenuItem>
          <MenuItem value="published">公開中</MenuItem>
        </TextField>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={!title.trim() || !content.trim()}
            onClick={onCreate}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
          >
            作成
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ color: '#2F3C8C', borderColor: '#5B6DC6', height: '40px', fontSize: '13px', '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' } }}
          >
            キャンセル
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
