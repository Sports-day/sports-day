import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { useState, useMemo } from 'react'
import { useGetAdminUsersQuery } from '@/gql/__generated__/graphql'
import { useMsGraphUsers } from '@/hooks/useMsGraphUsers'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, SAVE_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (selectedIds: string[]) => void
}

export function AddMemberDialog({ open, onClose, onAdd }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data } = useGetAdminUsersQuery({ skip: !open })

  const microsoftUserIds = useMemo(
    () =>
      (data?.users ?? [])
        .map((u) => u.identify?.microsoftUserId)
        .filter((id): id is string => !!id),
    [data],
  )
  const { msGraphUsers } = useMsGraphUsers(microsoftUserIds)

  const users = (data?.users ?? []).map(u => {
    const msUser = u.identify?.microsoftUserId
      ? msGraphUsers.get(u.identify.microsoftUserId)
      : undefined
    return {
      id: u.id,
      userName: msUser?.displayName ?? u.name ?? '',
      email: msUser?.mail ?? u.email ?? '',
    }
  })

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    onAdd(selectedIds)
    setSelectedIds([])
  }

  const handleClose = () => {
    setSelectedIds([])
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '15px', fontWeight: 600, color: '#2F3C8C', pb: 1 }}>
        チームメンバーの追加
      </DialogTitle>
      <DialogContent sx={{ p: 0, px: 2, pb: 2 }}>
        <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
          <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 40, position: 'sticky', top: 0, zIndex: 1 }} padding="checkbox" />
                <TableCell sx={{ ...LIST_TABLE_HEAD_SX, position: 'sticky', top: 0, zIndex: 1 }}>ID</TableCell>
                <TableCell sx={{ ...LIST_TABLE_HEAD_SX, position: 'sticky', top: 0, zIndex: 1 }}>ユーザー名</TableCell>
                <TableCell sx={{ ...LIST_TABLE_HEAD_SX, position: 'sticky', top: 0, zIndex: 1 }}>メール</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  onClick={() => toggle(user.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                >
                  <TableCell padding="checkbox" sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #D6D6D6' }}>
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      size="small"
                      sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#5B6DC6' } }}
                    />
                  </TableCell>
                  <TableCell sx={LIST_TABLE_CELL_SX}>{user.id}</TableCell>
                  <TableCell sx={LIST_TABLE_CELL_SX}>{user.userName}</TableCell>
                  <TableCell sx={LIST_TABLE_CELL_SX}>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              fontSize: '13px',
              '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' },
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            sx={{
              ...SAVE_BUTTON_SX,
              fontSize: '13px',
              '&:disabled': { backgroundColor: '#B0B8E8', color: '#FFFFFF' },
            }}
          >
            追加
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
