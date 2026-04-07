import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useUsers } from '../hooks/useUsers'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onCsvCreate: () => void
  onUserClick: (id: string) => void
}

export function UserListPage({ onCsvCreate, onUserClick }: Props) {
  const { data: users, loading, error } = useUsers()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        ユーザー
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのユーザー
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<UploadFileIcon />}
              onClick={onCsvCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              CSVで一括作成
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
          <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={LIST_TABLE_HEAD_SX}>ユーザーID</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>メール名</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>性別</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>クラス</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>チーム名</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    データがありません
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                    {[user.id, user.name, user.email, user.gender, user.groupName, user.teams.map(t => t.name).join(', ')].map((val, i) => (
                      <TableCell
                        key={i}
                        sx={{ ...LIST_TABLE_CELL_SX, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => onUserClick(user.id)}
                      >
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
