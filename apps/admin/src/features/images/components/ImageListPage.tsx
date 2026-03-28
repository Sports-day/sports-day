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
import { useImages } from '../hooks/useImages'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onCreateClick: () => void
}

export function ImageListPage({ onCreateClick }: Props) {
  const { data: images, loading, error } = useImages()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        画像
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべての画像
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
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', tableLayout: 'fixed', width: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 80 }}>ID</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 200 }}>名前</TableCell>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 300 }}>URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {images.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  images.map((image) => (
                    <TableRow key={image.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{image.id}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{image.name}</TableCell>
                      <TableCell sx={LIST_TABLE_CELL_SX}>{image.url}</TableCell>
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
