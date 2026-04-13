import { useState, useEffect, useRef } from 'react'
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
import { useCompetitionPdfData } from '../hooks/useCompetitionPdfData'
import { generateCompetitionPdfBlob, downloadCompetitionPdf } from '../lib/pdfGenerator'
import { showErrorToast } from '@/lib/toast'
import { SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  open: boolean
  onClose: () => void
  sportId: string
  sceneId: string
}

export function PdfExportDialog({ open, onClose, sportId, sceneId }: Props) {
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const data = useCompetitionPdfData(sportId, sceneId, !open)
  const hasBuiltPreview = useRef(false)

  // ダイアログが開いてデータ確定時に1度だけプレビュー生成
  useEffect(() => {
    if (!open || data.loading || data.leagues.length === 0 || hasBuiltPreview.current) return
    hasBuiltPreview.current = true

    let cancelled = false
    setGenerating(true)

    generateCompetitionPdfBlob(data)
      .then((url) => {
        if (!cancelled) setPreviewUrl(url)
      })
      .catch(() => {
        if (!cancelled) showErrorToast('PDFプレビューの生成に失敗しました。')
      })
      .finally(() => {
        if (!cancelled) setGenerating(false)
      })

    return () => { cancelled = true }
  }, [open, data])

  // ダイアログを閉じたらクリーンアップ
  useEffect(() => {
    if (!open) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      hasBuiltPreview.current = false
    }
  }, [open])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadCompetitionPdf(data)
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
          資料プレビュー — {data.sportName} {data.sceneName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading || generating || data.loading || data.leagues.length === 0}
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
              {data.loading ? 'データ読み込み中...' : 'PDF生成中...'}
            </Typography>
          </Box>
        ) : data.leagues.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: '#888' }}>
            <Typography>データがありません</Typography>
          </Box>
        ) : previewUrl ? (
          <Box sx={{ width: '100%', height: '70vh' }}>
            <iframe
              src={previewUrl}
              title="PDF Preview"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
            />
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
