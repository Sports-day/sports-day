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
import AddIcon from '@mui/icons-material/Add'
import { useLocations } from '../hooks/useLocations'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onNavigateToCreate: () => void
  onSelectLocation: (id: string) => void
}

export function LocationListPage({ onNavigateToCreate, onSelectLocation }: Props) {
  const { data: locations, loading, error } = useLocations()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        場所
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべての場所
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onNavigateToCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              場所を新規作成
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>場所ID</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>説明</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.map((location) => (
                  <TableRow
                    key={location.id}
                    hover
                    onClick={() => onSelectLocation(location.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                  >
                    <TableCell sx={LIST_TABLE_CELL_SX}>{location.id}</TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}>{location.name}</TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}>{location.description}</TableCell>
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
