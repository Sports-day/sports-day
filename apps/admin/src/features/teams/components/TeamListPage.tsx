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
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { useTeams } from '../hooks/useTeams'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onExport: () => void
  onBulkRename: () => void
  onTeamClick: (id: string) => void
}

export function TeamListPage({ onExport, onBulkRename, onTeamClick }: Props) {
  const { data: teams, loading, error } = useTeams()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        チーム
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのチーム
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={onExport}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              エクスポート
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<DriveFileRenameOutlineIcon />}
              onClick={onBulkRename}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              一括名前変更
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
          <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={LIST_TABLE_HEAD_SX}>チームID</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>チーム名</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>クラス</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>タグ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    データがありません
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team) => (
                  <TableRow
                    key={team.id}
                    hover
                    onClick={() => onTeamClick(team.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                  >
                    <TableCell sx={LIST_TABLE_CELL_SX}>{team.id}</TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}>{team.name}</TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}>{team.groupName}</TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}></TableCell>
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
