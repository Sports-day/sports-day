import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onCreateClick: () => void
  onAnnouncementClick: (id: string) => void
}

export function InformationListPage({ onCreateClick, onAnnouncementClick }: Props) {
  const { data: announcements, loading, error } = useAnnouncements()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        お知らせ
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              お知らせ一覧
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={onCreateClick}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              作成
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 80 }}>ID</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 200 }}>名前</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 400 }}>内容</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 120 }}>ステータス</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 160 }}>作成日</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      onClick={() => onAnnouncementClick(item.id)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                    >
                      <TableCell sx={LIST_TABLE_CELL_SX}>{item.id}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{item.name}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{item.content}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>
                        <Chip
                          label={item.status === 'published' ? '公開中' : '下書き'}
                          size="small"
                          sx={{
                            bgcolor: item.status === 'published' ? '#E8EAF6' : '#F5F5F5',
                            color: item.status === 'published' ? '#3949AB' : '#9E9E9E',
                            fontSize: '11px',
                            fontWeight: 600,
                            height: 22,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                      </TableCell>
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
