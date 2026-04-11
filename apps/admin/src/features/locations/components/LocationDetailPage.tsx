import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { BackButton } from '@/components/ui/BackButton'
import { useLocationDetail } from '../hooks/useLocationDetail'
import { SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, CARD_FIELD_SX } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Props = {
  locationId: string
  onBack: () => void
  onSave: () => void
  onDelete: () => void
}

export function LocationDetailPage({ locationId, onBack, onSave, onDelete }: Props) {
  const { location, name, setName, dirty, handleSave, handleDelete } = useLocationDetail(locationId, onSave, onDelete)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  useUnsavedWarning(dirty)

  if (!location) {
    return (
      <Box>
        <Typography sx={{ color: '#2F3C8C', mt: 2 }}>場所が見つかりません</Typography>
      </Box>
    )
  }

  const handleSaveWithToast = async () => {
    await handleSave()
    showToast('場所を保存しました')
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('場所を削除しました')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          場所
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {location.name}
        </Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            場所の編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="名称*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              error={!name.trim() && dirty}
              helperText={!name.trim() && dirty ? 'この項目は必須です' : name.length >= 60 ? `${name.length}/64文字` : ''}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
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
                disabled={!dirty || !name.trim()}
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
        title="場所を削除しますか？"
        description={`「${location.name}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
