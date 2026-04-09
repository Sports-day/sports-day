import { useState, useCallback } from 'react'
import { Box, Breadcrumbs, ButtonBase, Button, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import CloseIcon from '@mui/icons-material/Close'
import { useImageCreate } from '../hooks/useImageCreate'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onBack: () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageCreatePage({ onBack }: Props) {
  const { file, fileInputRef, handleFileSelect, handleCreate, uploading, error } = useImageCreate(() => {
    showToast('画像をアップロードしました')
    onBack()
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const selectFile = useCallback((f: File | null) => {
    handleFileSelect(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }, [handleFileSelect])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f && !f.type.startsWith('image/')) return
    selectFile(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith('image/')) {
      selectFile(f)
    }
  }, [selectFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const onCreate = async () => {
    if (!file) return
    await handleCreate()
  }

  const handleClear = () => {
    selectFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {!file ? (
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            sx={{
              border: '2px dashed',
              borderColor: dragOver ? '#3949AB' : '#7F8CD6',
              borderRadius: 2,
              backgroundColor: dragOver ? 'rgba(57, 73, 171, 0.06)' : 'rgba(255, 255, 255, 0.4)',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#3949AB',
                backgroundColor: 'rgba(57, 73, 171, 0.06)',
              },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#5F6DC2', opacity: 0.7 }} />
            <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 500 }}>
              ここにファイルをドロップ、またはクリックして選択
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#5B6DC6', opacity: 0.7 }}>
              JPEG, PNG, GIF, WebP に対応（10MB以下）
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: '1px solid #7F8CD6',
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              p: 2,
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  backgroundColor: '#EFF0F8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {preview ? (
                  <Box
                    component="img"
                    src={preview}
                    alt="プレビュー"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <InsertPhotoIcon sx={{ fontSize: 32, color: '#5B6DC6', opacity: 0.4 }} />
                )}
              </Box>
              <Box
                onClick={handleClear}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: '#5F6DC2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  '&:hover': { backgroundColor: '#D71212' },
                }}
              >
                <CloseIcon sx={{ fontSize: 14, color: '#fff' }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mt: 0.5 }}>
                {formatFileSize(file.size)} | {file.name.split('.').pop()?.toUpperCase() || '不明'}
              </Typography>
            </Box>
          </Box>
        )}

        {error && (
          <Typography sx={{ fontSize: '13px', color: '#D71212', mt: 1.5 }}>
            アップロードに失敗しました。ファイルを確認して再度お試しください。
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={uploading}
            sx={{ height: '40px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            戻る
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={!file || uploading}
            onClick={onCreate}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
          >
            {uploading ? 'アップロード中...' : 'アップロード'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
