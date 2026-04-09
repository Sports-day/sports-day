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
import { QueryError } from '@/components/ui/QueryError'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

const CLICKABLE_CELL_SX = {
  ...LIST_TABLE_CELL_SX,
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
}

type Props = {
  onCreateClick: () => void
  onImageClick: (id: string) => void
}

export function ImageListPage({ onCreateClick, onImageClick }: Props) {
  const { data: images, loading, error } = useImages()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        画像
      </Typography>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
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
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...LIST_TABLE_HEAD_SX, width: 56 }}>プレビュー</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>ID</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {images.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                      データがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  images.map((image) => (
                    <TableRow
                      key={image.id}
                      hover
                      onClick={() => onImageClick(image.id)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                    >
                      <TableCell sx={{ ...LIST_TABLE_CELL_SX, width: 56, py: 0.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            border: '1px solid #D6D6D6',
                            backgroundColor: '#EFF0F8',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          {image.url && (
                            <Box
                              component="img"
                              src={image.url}
                              alt={image.id}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={CLICKABLE_CELL_SX}>{image.id}</TableCell>
                      <TableCell sx={CLICKABLE_CELL_SX}>{image.status}</TableCell>
                      <TableCell sx={CLICKABLE_CELL_SX}>{image.url}</TableCell>
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
