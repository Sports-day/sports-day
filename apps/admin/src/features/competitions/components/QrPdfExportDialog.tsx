import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import { useQrPdfData } from '../hooks/useQrPdfData'
import { generateQrPdfBlob, downloadQrPdf } from '../lib/pdfQrGenerator'
import { showErrorToast } from '@/lib/toast'
import { SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  open: boolean
  onClose: () => void
  competitionId: string
  competitionName: string
}

export function QrPdfExportDialog({ open, onClose, competitionId, competitionName }: Props) {
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const data = useQrPdfData(competitionId, competitionName, !open)

  // データ準備完了時にプレビュー生成
  const buildPreview = useCallback(async () => {
    if (data.loading || data.locations.length === 0) return

    setGenerating(true)
    try {
      const url = await generateQrPdfBlob(data)
      setPreviewUrl(url)
    } catch {
      showErrorToast('QR PDFプレビューの生成に失敗しました。')
    } finally {
      setGenerating(false)
    }
  }, [data])

  // ダイアログが開いてデータ確定時にプレビュー生成
  useEffect(() => {
    if (!open || previewUrl || generating) return
    buildPreview()
  }, [open, data.loading, data.locations.length, buildPreview])

  // ダイアログを閉じたらクリーンアップ
  useEffect(() => {
    if (!open) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setGenerating(false)
    }
  }, [open])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadQrPdf(data)
    } catch {
      showErrorToast('PDFダウンロードに失敗しました。再度お試しください。')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '900px',
          maxHeight: '90vh',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
          審判QRコード — {competitionName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading || generating || data.loading || data.locations.length === 0}
            sx={{ ...SAVE_BUTTON_SX, fontSize: '13px' }}
          >
            {downloading ? '保存中...' : 'PDFダウンロード'}
          </Button>
          <Button
            variant="text"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              backgroundColor: '#EFF0F8',
              color: '#2F3C8C',
              fontSize: '13px',
              borderRadius: 1,
              px: 1.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#E5E6F0', boxShadow: 'none' },
            }}
          >
            閉じる
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 2, pb: 2, overflow: 'hidden' }}>
        {data.loading || generating ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
            <CircularProgress />
            <Typography sx={{ fontSize: '13px', color: '#888' }}>
              {data.loading ? 'データ読み込み中...' : 'QR PDF生成中...'}
            </Typography>
          </Box>
        ) : data.locations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: '#888' }}>
            <Typography>試合にロケーションが設定されていません</Typography>
          </Box>
        ) : previewUrl ? (
          <Box sx={{ width: '100%', height: '70vh' }}>
            <iframe
              src={previewUrl}
              title="QR PDF Preview"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
            />
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
