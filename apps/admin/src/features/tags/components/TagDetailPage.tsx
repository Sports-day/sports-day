import { Box, Breadcrumbs, Button, ButtonBase, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { useTagDetail } from '../hooks/useTagDetail'
import { showToast } from '@/lib/toast'
import { CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  tagId: string
  onBack: () => void
}

export function TagDetailPage({ tagId, onBack }: Props) {
  const { name, setName, enabled, setEnabled, handleSave, handleDelete, tagName } = useTagDetail(tagId)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = () => {
    handleSave()
    setDirty(false)
    showToast('タグを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('タグを削除しました')
    onBack()
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          タグ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tagName}</Typography>
      </Breadcrumbs>

      <Box sx={{ background: CARD_GRADIENT, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
          タグ情報
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, mb: 2 }} onChangeCapture={() => setDirty(true)}>
          <TextField
            size="small"
            label="タグ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ ...CARD_FIELD_SX, width: 200 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                size="small"
                sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#5B6DC6' } }}
              />
            }
            label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>有効</Typography>}
            sx={{ ml: 0 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(true)}
            sx={DELETE_BUTTON_SX}
          >
            このタグを削除
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          タグを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            「{tagName}」を削除します。この操作は元に戻せません。
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
