import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useRoles } from '../hooks/useRoles'
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

type Props = {
  onCreateClick: () => void
  onRoleClick: (id: string) => void
}

export function PermissionsPage({ onCreateClick, onRoleClick }: Props) {
  const { data: roles, loading, error, toggleDefault } = useRoles()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        権限
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのロール
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
                <TableCell sx={TABLE_HEAD_SX}>ロールID</TableCell>
                <TableCell sx={TABLE_HEAD_SX}>名前</TableCell>
                <TableCell sx={TABLE_HEAD_SX}>備考</TableCell>
                <TableCell sx={TABLE_HEAD_SX}>初期ロール</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow
                  key={role.id}
                  hover
                  onClick={() => onRoleClick(role.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                >
                  <TableCell sx={TABLE_CELL_SX}>{role.id}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{role.name}</TableCell>
                  <TableCell sx={TABLE_CELL_SX}>{role.description}</TableCell>
                  <TableCell sx={TABLE_CELL_SX} onClick={(e) => { e.stopPropagation(); toggleDefault(role.id) }}>
                    <Checkbox
                      checked={role.isDefault}
                      size="small"
                      onChange={() => toggleDefault(role.id)}
                      sx={{ color: '#5B6DC6', '&.Mui-checked': { color: '#3949AB' }, p: 0 }}
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
