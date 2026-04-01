import { Box, Breadcrumbs, ButtonBase, Button, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { useImageCreate } from '../hooks/useImageCreate'
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

export function ImageCreatePage({ onBack }: Props) {
  const { name, setName, url, setUrl, handleCreate } = useImageCreate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      if (!name) setName(file.name)
      // blob: URL はリロードで無効になるため data URL に変換して永続化する
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') setUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCreate = () => {
    setSubmitted(true)
    if (!name.trim()) return
    handleCreate()
    showToast('画像を作成しました')
    onBack()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          画像
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>画像作成</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          画像作成
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="名前*"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={submitted && !name.trim()}
          helperText={submitted && !name.trim() ? 'この項目は必須です' : ''}
          sx={INPUT_SX}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ ...INPUT_SX, mb: 0, flexGrow: 1 }}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => inputRef.current?.click()}
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
        </Box>

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
