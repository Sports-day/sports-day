import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useAddEntryDialog } from '../hooks/useAddEntryDialog'
import { useTeams } from '@/features/teams'

type Props = {
  open: boolean
  leagueName: string
  competitionName: string
  existingTeamNames?: string[]
  onClose: () => void
  onAdd: (selectedIds: string[]) => void
}

export function AddEntryDialog({ open, leagueName, competitionName, existingTeamNames = [], onClose, onAdd }: Props) {
  const { data: teams } = useTeams()
  const existingSet = new Set(existingTeamNames)
  const availableTeams = teams
    .map(t => ({ id: t.id, name: t.name }))
    .filter(t => !existingSet.has(t.name))
  const { selected, allSelected, toggle, toggleAll, handleAdd } = useAddEntryDialog(availableTeams.map(t => t.id), onAdd)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#EFF0F8',
          borderRadius: 2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        },
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        {/* タイトル */}
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 0.5 }}>
          エントリーの追加
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.7, mb: 2 }}>
          {competitionName} / {leagueName}
        </Typography>

        {/* テーブルエリア */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D0D3E8',
            borderRadius: 1,
            overflow: 'hidden',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #D0D3E8',
                    width: 48,
                  }}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selected.length > 0 && !allSelected}
                    onChange={toggleAll}
                    size="small"
                    sx={{ color: '#AAAAAA', '&.Mui-checked': { color: '#5B6DC6' }, '&.MuiCheckbox-indeterminate': { color: '#5B6DC6' } }}
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #D0D3E8', color: '#333', fontSize: '13px', fontWeight: 500, width: 100 }}>
                  ID
                </TableCell>
                <TableCell sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #D0D3E8', color: '#333', fontSize: '13px', fontWeight: 500 }}>
                  チーム名
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableTeams.length === 0 ? null : availableTeams.map(team => (
                <TableRow
                  key={team.id}
                  hover
                  onClick={() => toggle(team.id)}
                  sx={{ cursor: 'pointer', backgroundColor: selected.includes(team.id) ? '#F0F2FF' : 'transparent' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(team.id)}
                      size="small"
                      sx={{ color: '#AAAAAA', '&.Mui-checked': { color: '#5B6DC6' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: '#333' }}>{team.id}</TableCell>
                  <TableCell sx={{ fontSize: '13px', color: '#333' }}>{team.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {availableTeams.length === 0 && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#666' }}>チームがありません</Typography>
            </Box>
          )}
        </Box>

        {/* ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#E53935',
              color: '#E53935',
              fontSize: '14px',
              px: 3,
              '&:hover': { borderColor: '#C62828', backgroundColor: '#FFF0F0' },
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAdd(onClose)}
            sx={{
              backgroundColor: '#5B6DC6',
              color: '#FFFFFF',
              fontSize: '14px',
              px: 3,
              '&:hover': { backgroundColor: '#4A5BB5' },
            }}
          >
            追加
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
