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
import { QueryError } from '@/components/ui/QueryError'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { DragHandle } from '@/components/ui/DragHandle'
import { useDisplayOrderDnD } from '@/hooks/useDisplayOrderDnD'
import { useUpdateAdminInformationsDisplayOrderMutation } from '@/gql/__generated__/graphql'

type Props = {
  onCreateClick: () => void
  onAnnouncementClick: (id: string) => void
}

export function InformationListPage({ onCreateClick, onAnnouncementClick }: Props) {
  const { data: announcements, loading, error } = useAnnouncements()

  const [reorderMutation] = useUpdateAdminInformationsDisplayOrderMutation({
    refetchQueries: ['GetAdminInformations'],
    awaitRefetchQueries: true,
  })

  const {
    displayItems,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDisplayOrderDnD(announcements, (input) => reorderMutation({ variables: { input } }))

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        お知らせ
      </Typography>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
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
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 40, px: 0.5 }} />
                  <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>内容</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 120 }}>ステータス</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  displayItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      hover
                      onClick={() => onAnnouncementClick(item.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#E5E6F0' },
                        opacity: dragIndex === index ? 0.5 : 1,
                        borderLeft: dragOverIndex === index && dragIndex !== index ? '3px solid #3949AB' : '3px solid transparent',
                      }}
                    >
                      <TableCell sx={{ ...LIST_TABLE_CELL_SX, width: 40, px: 0.5 }}>
                        <DragHandle />
                      </TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{item.title}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{item.content}</TableCell>
                      <TableCell sx={{ ...LIST_TABLE_CELL_SX, width: 120 }}>
                        <Chip
                          label={item.status === 'published' ? '公開中' : '下書き'}
                          size="small"
                          sx={{
                            bgcolor: item.status === 'published' ? '#E8EAF6' : '#F5F5F5',
                            color: item.status === 'published' ? '#3949AB' : '#9E9E9E',
                            fontSize: '11px',
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
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
