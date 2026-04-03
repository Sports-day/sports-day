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
import { useTags } from '../hooks/useTags'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

const TABLE_HEAD_SX = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const TABLE_CELL_SX = {
  fontSize: '13px',
  color: '#2F3C8C',
  backgroundColor: '#FFFFFF',
  borderBottom: '1px solid #D6D6D6',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  'tr:last-child &': { borderBottom: 'none' },
}

const CLICKABLE_CELL_SX = {
  ...TABLE_CELL_SX,
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
  'tr:last-child &': { borderBottom: 'none' },
}

type Props = {
  onCreateClick: () => void
  onTagClick: (id: string) => void
}

export function TagListPage({ onCreateClick, onTagClick }: Props) {
  const { data: tags, loading, error } = useTags()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        タグ
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのタグ
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
                <TableCell sx={TABLE_HEAD_SX}>タグID</TableCell>
                <TableCell sx={TABLE_HEAD_SX}>名前</TableCell>
                <TableCell sx={TABLE_HEAD_SX}>状態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    データがありません
                  </TableCell>
                </TableRow>
              ) : tags.map((tag) => (
                <TableRow key={tag.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                  <TableCell sx={CLICKABLE_CELL_SX} onClick={() => onTagClick(tag.id)}>{tag.id}</TableCell>
                  <TableCell sx={CLICKABLE_CELL_SX} onClick={() => onTagClick(tag.id)}>{tag.name}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>
                    <Chip
                      label={tag.isDeleted ? '無効' : '有効'}
                      size="small"
                      sx={{
                        fontSize: '11px',
                        backgroundColor: tag.isDeleted ? '#F5F5F5' : '#E8F5E9',
                        color: tag.isDeleted ? '#9E9E9E' : '#2E7D32',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
