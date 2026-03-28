import { Box, Button, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { useImages } from '../hooks/useImages'

type Props = {
  onBack: () => void
}

export function ImageCreatePage({ onBack }: Props) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addImage } = useImages()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f ? f.name : null)
  }

  const handleUpload = () => {
    if (file) {
      const url = URL.createObjectURL(file)
      addImage(file.name, url)
    }
    setFileName(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
    onBack()
  }

  return (
    <Box>
      {/* パンくずリスト */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Typography
          component="span"
          onClick={onBack}
          sx={{ fontSize: '16px', color: '#2F3C8C', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
        >
          画像
        </Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>/</Typography>
        <Typography component="span" sx={{ fontSize: '16px', color: '#2F3C8C' }}>画像作成</Typography>
      </Box>

      {/* カード */}
      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          画像作成
        </Typography>

        {/* ファイル選択行 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* hidden file input */}
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
              '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' },
            }}
          >
            ファイルを選択
          </Button>

          <Typography sx={{ fontSize: '13px', color: '#2F3C8C', minWidth: '120px' }}>
            {fileName ?? '選択されていません'}
          </Typography>

          <Button
            variant="contained"
            size="small"
            onClick={handleUpload}
            disabled={!fileName}
            sx={{
              ...SAVE_BUTTON_SX,
              fontSize: '13px',
              '&:disabled': { backgroundColor: '#B0B8E8', color: '#fff' },
            }}
          >
            upload
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
