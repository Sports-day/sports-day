import { Box, Breadcrumbs, ButtonBase, Button, TextField, Typography } from '@mui/material'
import { BackButton } from '@/components/ui/BackButton'
import { useState } from 'react'
import { useTagCreate } from '../hooks/useTagCreate'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

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

export function TagCreatePage({ onBack }: Props) {
  const { name, setName, handleCreate } = useTagCreate()
  const [submitted, setSubmitted] = useState(false)

  const onCreate = () => {
    setSubmitted(true)
    if (!name.trim()) return
    handleCreate()
    showToast('タグを作成しました')
    onBack()
  }

  return (
    <Box>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          タグ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>タグ作成</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          タグ作成
        </Typography>

        <TextField fullWidth size="small" label="名前*" value={name} onChange={(e) => setName(e.target.value)} error={submitted && !name.trim()} helperText={submitted && !name.trim() ? 'この項目は必須です' : name.length >= 60 ? `${name.length}/64文字` : ''} sx={INPUT_SX} slotProps={{ htmlInput: { maxLength: 64 } }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={!name.trim()}
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
