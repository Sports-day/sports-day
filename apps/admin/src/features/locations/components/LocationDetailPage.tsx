import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useLocationDetail } from '../hooks/useLocationDetail'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, CARD_FIELD_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'

type Props = {
  locationId: string
  onBack: () => void
  onSave: () => void
  onDelete: () => void
}

export function LocationDetailPage({ locationId, onBack, onSave, onDelete }: Props) {
  const { location, name, note, setName, setNote, handleSave, handleDelete } = useLocationDetail(locationId, onSave, onDelete)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  if (!location) {
    return (
      <Box>
        <Typography sx={{ color: '#2F3C8C', mt: 2 }}>場所が見つかりません</Typography>
      </Box>
    )
  }

  const handleSaveWithToast = () => {
    handleSave()
    setDirty(false)
    showToast('場所を保存しました')
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('場所を削除しました')
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          場所
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {location.name}
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            場所の編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onChangeCapture={() => setDirty(true)}>
            <TextField
              label="名称*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />

            <TextField
              label="備考"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={DELETE_BUTTON_SX}
              >
                この場所を削除
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={handleSaveWithToast}
                disabled={!name.trim()}
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
        aria-labelledby="delete-dialog-title"
        slotProps={{ paper: { sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          場所を削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            「{location.name}」を削除します。この操作は元に戻せません。
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
