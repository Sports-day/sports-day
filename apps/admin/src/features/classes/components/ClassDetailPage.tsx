import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { BackButton } from '@/components/ui/BackButton'
import { useClassDetail } from '../hooks/useClassDetail'
import { useUnsavedWarning } from '@/hooks/useUnsavedWarning'
import { showToast } from '@/lib/toast'
import { AddClassMemberDialog } from './AddClassMemberDialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  CARD_TABLE_HEAD_SX,
  CARD_TABLE_CELL_SX,
  CARD_FIELD_SX,
  SAVE_BUTTON_SX,
  DELETE_BUTTON_SX,
  BREADCRUMB_LINK_SX,
  BREADCRUMB_CURRENT_SX,
  CARD_GRADIENT,
} from '@/styles/commonSx'

type Props = {
  classId: string
  onBack: () => void
}

export function ClassDetailPage({ classId, onBack }: Props) {
  const {
    name,
    setName,
    dirty,
    members,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleSave,
    handleDelete,
    handleAddMembers,
    handleDeleteMember,
    selectableUsers,
    className,
  } = useClassDetail(classId)

  useUnsavedWarning(dirty)

  const onSave = async () => {
    await handleSave()
    showToast('クラスを保存しました')
    onBack()
  }

  const onConfirmDelete = () => {
    setDeleteDialogOpen(false)
    handleDelete()
    showToast('クラスを削除しました')
    onBack()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <BackButton onClick={onBack} />
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          クラス
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{className}</Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            クラスの編集
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="クラス名*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
              error={!name.trim() && dirty}
              helperText={!name.trim() && dirty ? 'この項目は必須です' : name.length >= 60 ? `${name.length}/64文字` : ''}
              sx={CARD_FIELD_SX}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon sx={{ color: '#D71212' }} />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ ...DELETE_BUTTON_SX, flexShrink: 0 }}
              >
                このクラスを削除
              </Button>
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

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            {className}のメンバー
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {['名前', 'メール', '性別', ''].map((header, i) => (
                  <TableCell key={i} sx={{ ...CARD_TABLE_HEAD_SX, ...(i === 3 ? { width: 48 } : {}) }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#888', fontSize: '13px' }}>
                    メンバーがいません
                  </TableCell>
                </TableRow>
              ) : members.map((member, i) => (
                <TableRow key={member.id}>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{member.name}</TableCell>
                  <TableCell sx={CARD_TABLE_CELL_SX}>{member.email}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, color: member.gender === '女' ? '#D71212' : undefined }}>{member.gender}</TableCell>
                  <TableCell sx={{ ...CARD_TABLE_CELL_SX, width: 48, p: 0, textAlign: 'center' }}>
                    <DeleteIcon
                      onClick={() => handleDeleteMember(i)}
                      sx={{ fontSize: 20, color: '#D71212', cursor: 'pointer', opacity: 0.7, '&:hover': { opacity: 1 } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={SAVE_BUTTON_SX}
            >
              メンバーを追加
            </Button>
          </Box>
        </CardContent>
      </Card>

      <AddClassMemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddMembers}
        selectableUsers={selectableUsers}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="クラスを削除しますか？"
        description={`「${className}」を削除します。この操作は元に戻せません。`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  )
}
