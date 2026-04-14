import { Box, Breadcrumbs, Button, ButtonBase, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material'
import { BackButton } from '@/components/ui/BackButton'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { useAnnouncementDetail } from '../hooks/useAnnouncementDetail'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Props = {
  announcementId: string
  onBack: () => void
}

export function InformationDetailPage({ announcementId, onBack }: Props) {
  const { announcementTitle, title, setTitle, content, setContent, status, setStatus, dirty, handleSave, handleDelete } =
    useAnnouncementDetail(announcementId)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleSave()
      showToast('お知らせを保存しました')
      onBack()
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const onConfirmDelete = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setDeleteDialogOpen(false)
    try {
      await handleDelete()
      showToast('お知らせを削除しました')
      onBack()
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          お知らせ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{announcementTitle}</Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {announcementTitle}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="タイトル*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
              error={!title.trim() && dirty}
              helperText={!title.trim() && dirty ? 'この項目は必須です' : title.length >= 60 ? `${title.length}/64文字` : ''}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />
            <TextField
              label="内容*"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={4}
              error={!content.trim() && dirty}
              helperText={!content.trim() && dirty ? 'この項目は必須です' : `${content.length}/1000文字`}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 1000 } }}
            />

            <TextField
              label="ステータス"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              fullWidth
              size="small"
              select
              sx={CARD_FIELD_SX}
            >
              <MenuItem value="draft">下書き</MenuItem>
              <MenuItem value="published">公開中</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteDialogOpen(true)}
                sx={DELETE_BUTTON_SX}
              >
                このお知らせを削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty || !title.trim() || !content.trim() || isSubmitting}
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="お知らせを削除しますか？"
        description="このお知らせを削除します。この操作は元に戻せません。"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
