import { Box, Breadcrumbs, Button, ButtonBase, Card, CardContent, TextField, Typography } from '@mui/material'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckIcon from '@mui/icons-material/Check'
import { BackButton } from '@/components/ui/BackButton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
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
  const { name, setName, dirty, enable, handleSave, handleToggleEnable, handleDelete, tagName } = useTagDetail(tagId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  useUnsavedWarning(dirty)

  const onSave = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleSave()
      showToast('タグを保存しました')
      onBack()
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const onToggleEnable = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleToggleEnable()
      showToast(enable ? 'タグを無効化しました' : 'タグを有効化しました')
    } catch {
      // エラートーストはhook側で表示済み
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDelete = async () => {
    setDeleteDialogOpen(false)
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await handleDelete()
      showToast('タグを削除しました')
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
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isSubmitting}
                sx={DELETE_BUTTON_SX}
              >
                削除
              </Button>
              {enable ? (
                <Button
                  variant="outlined"
                  startIcon={<BlockOutlinedIcon sx={{ color: '#D71212' }} />}
                  onClick={onToggleEnable}
                  disabled={isSubmitting}
                  sx={DELETE_BUTTON_SX}
                >
                  無効化
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<CheckCircleOutlineIcon sx={{ color: '#2E7D32' }} />}
                  onClick={onToggleEnable}
                  disabled={isSubmitting}
                  sx={{
                    fontSize: '13px',
                    color: '#2E7D32',
                    borderColor: '#2E7D32',
                    '&:hover': { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
                  }}
                >
                  有効化
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth
                startIcon={<CheckIcon />}
                onClick={onSave}
                disabled={!dirty || !name.trim() || isSubmitting}
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
        description={`「${tagName}」を削除します。この操作は取り消せません。`}
        confirmLabel="削除"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onDelete}
      />
    </Box>
  )
}
