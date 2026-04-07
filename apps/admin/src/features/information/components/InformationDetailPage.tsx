import { Box, Breadcrumbs, Button, ButtonBase, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { useAnnouncementDetail } from '../hooks/useAnnouncementDetail'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  announcementId: string
  onBack: () => void
}

export function InformationDetailPage({ announcementId, onBack }: Props) {
  const { announcementTitle, title, setTitle, content, setContent, status, setStatus, handleSave, handleDelete } =
    useAnnouncementDetail(announcementId)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = () => {
    handleSave()
    setDirty(false)
    showToast('お知らせを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('お知らせを削除しました')
    onBack()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          お知らせ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{announcementTitle}</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {announcementTitle}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }} onChangeCapture={() => setDirty(true)}>
            <TextField
              label="タイトル*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={4}
              sx={CARD_FIELD_SX}
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
                sx={SAVE_BUTTON_SX}
              >
                保存
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          お知らせを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            このお知らせを削除します。この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontSize: '13px', color: '#2F3C8C', '&:hover': { backgroundColor: '#E8EAF6' } }}
          >
            キャンセル
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="outlined"
            sx={{
              fontSize: '13px',
              color: '#D71212',
              borderColor: '#D71212',
              '&:hover': { backgroundColor: '#FDECEA', borderColor: '#D71212' },
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
