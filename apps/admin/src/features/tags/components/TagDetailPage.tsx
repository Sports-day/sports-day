import { Box, Breadcrumbs, Button, ButtonBase, Card, CardContent, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { useTagDetail } from '../hooks/useTagDetail'
import { showToast } from '@/lib/toast'
import { CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Props = {
  tagId: string
  onBack: () => void
}

export function TagDetailPage({ tagId, onBack }: Props) {
  const { name, setName, dirty, isDeleted, handleSave, handleDelete, handleRestore, tagName } = useTagDetail(tagId)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = async () => {
    await handleSave()
    showToast('タグを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('タグを削除しました')
    onBack()
  }

  const onRestore = () => {
    handleRestore()
    showToast('タグを復元しました')
  }

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          タグ
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tagName}</Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            タグの編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="タグ名*"
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
              {isDeleted ? (
                <Button
                  variant="outlined"
                  onClick={onRestore}
                  sx={{
                    fontSize: '13px',
                    color: '#2E7D32',
                    borderColor: '#2E7D32',
                    '&:hover': { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
                  }}
                >
                  このタグを復元
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={DELETE_BUTTON_SX}
                >
                  このタグを削除
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
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
        title="タグを削除しますか？"
        description={`「${tagName}」を削除します。削除後は一覧から無効として表示されます。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
