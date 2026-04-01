import { Box, Breadcrumbs, Button, ButtonBase, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { useRoleDetail } from '../hooks/useRoleDetail'
import { ALL_PERMISSIONS } from '../types'
import { showToast } from '@/lib/toast'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_FIELD_SX, SAVE_BUTTON_SX, DELETE_BUTTON_SX, CARD_GRADIENT } from '@/styles/commonSx'

type Props = {
  roleId: string
  onBack: () => void
}

export function RoleDetailPage({ roleId, onBack }: Props) {
  const { roleName, roleId: id, name, setName, description, setDescription, isDefault, setIsDefault, permissions, togglePermission, handleSave, handleDelete } =
    useRoleDetail(roleId)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedWarning(dirty)

  const permissionsByCategory = ALL_PERMISSIONS.reduce<Record<string, typeof ALL_PERMISSIONS>>((acc, p) => {
    ;(acc[p.category] ??= []).push(p)
    return acc
  }, {})

  const onSave = () => {
    handleSave()
    setDirty(false)
    showToast('ロールを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('ロールを削除しました')
    onBack()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          権限
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{roleName}</Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {roleName}を編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }} onChangeCapture={() => setDirty(true)}>
            <TextField
              label="ロールID"
              value={id}
              fullWidth
              size="small"
              disabled
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="名前*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <TextField
              label="備考"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              size="small"
              sx={CARD_FIELD_SX}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  size="small"
                  sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#5B6DC6' } }}
                />
              }
              label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>初期ロール</Typography>}
              sx={{ ml: 0 }}
            />

            <Box sx={{ border: '1px solid', borderColor: 'primary.light', borderRadius: 1.5, px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>権限</Typography>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <Box key={category} sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#2F3C8C', fontWeight: 600, mb: 0.5 }}>{category}</Typography>
                  {perms.map(perm => (
                    <FormControlLabel
                      key={perm.key}
                      control={
                        <Checkbox
                          checked={permissions.includes(perm.key)}
                          onChange={() => togglePermission(perm.key)}
                          size="small"
                          sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.dark' } }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>{perm.label}</Typography>}
                      sx={{ ml: 0, display: 'block' }}
                    />
                  ))}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteDialogOpen(true)}
                sx={DELETE_BUTTON_SX}
              >
                この権限を削除
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
        aria-labelledby="delete-dialog-title"
        PaperProps={{ sx: { borderRadius: 2, p: 1, backgroundColor: '#EFF0F8' } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 0.5 }}>
          ロールを削除しますか？
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: '13px', color: '#2F3C8C' }}>
            「{roleName}」を削除します。この操作は元に戻せません。
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
