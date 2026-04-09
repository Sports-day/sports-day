import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { useAddEntryDialog } from '../hooks/useAddEntryDialog'
import { useTeams } from '@/features/teams'

type Props = {
  open: boolean
  leagueName: string
  existingTeamNames?: string[]
  onClose: () => void
  onAdd: (selectedIds: string[]) => void
}

export function AddEntryDialog({ open, leagueName, existingTeamNames = [], onClose, onAdd }: Props) {
  const { data: teams } = useTeams()
  const existingSet = new Set(existingTeamNames)
  const availableTeams = teams
    .map(t => ({ id: t.id, name: t.name }))
    .filter(t => !existingSet.has(t.name))
  const { selected, allSelected, toggle, toggleAll, handleAdd } = useAddEntryDialog(availableTeams.map(t => t.id), onAdd)
  const [search, setSearch] = useState('')

  const filteredTeams = availableTeams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <GroupAddIcon sx={{ fontSize: 20, color: '#2F3C8C' }} />
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
            エントリーの追加
          </Typography>
          {selected.length > 0 && (
            <Chip
              label={`${selected.length}件選択中`}
              size="small"
              sx={{ bgcolor: '#3949AB', color: '#fff', fontWeight: 600, fontSize: '11px', height: 22 }}
            />
          )}
        </Box>
        <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.7, mb: 2 }}>
          {leagueName}
        </Typography>

        {/* 検索 */}
        <TextField
          placeholder="チーム名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#5B6DC6' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              borderRadius: 1.5,
              '& fieldset': { borderColor: '#D0D3E8' },
              '&:hover fieldset': { borderColor: '#5B6DC6' },
              '&.Mui-focused fieldset': { borderColor: '#5B6DC6' },
            },
            '& input::placeholder': { color: '#2F3C8C', opacity: 0.4 },
          }}
        />

        {/* 全選択 */}
        <Box
          onClick={toggleAll}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            cursor: 'pointer',
            borderRadius: 1,
            '&:hover': { backgroundColor: '#E0E3F5' },
          }}
        >
          <Checkbox
            checked={allSelected}
            indeterminate={selected.length > 0 && !allSelected}
            size="small"
            sx={{ p: 0, color: '#AAAAAA', '&.Mui-checked': { color: '#5B6DC6' }, '&.MuiCheckbox-indeterminate': { color: '#5B6DC6' } }}
          />
          <Typography sx={{ fontSize: '12px', color: '#2F3C8C', opacity: 0.6, fontWeight: 500 }}>
            すべて選択
          </Typography>
        </Box>

        {/* チームリスト */}
        <Box
          sx={{
            maxHeight: 360,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            mt: 0.5,
            pr: 0.5,
          }}
        >
          {filteredTeams.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#666' }}>
                {search ? '該当するチームがありません' : '追加できるチームがありません'}
              </Typography>
            </Box>
          ) : (
            filteredTeams.map(team => {
              const isSelected = selected.includes(team.id)
              return (
                <Box
                  key={team.id}
                  onClick={() => toggle(team.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#E8EAF6' : '#fff',
                    border: '1px solid',
                    borderColor: isSelected ? '#5B6DC6' : '#E0E3F5',
                    transition: 'all 0.12s',
                    '&:hover': {
                      borderColor: '#5B6DC6',
                      backgroundColor: isSelected ? '#DCE0F5' : '#F5F6FC',
                    },
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    size="small"
                    sx={{ p: 0, color: '#AAAAAA', '&.Mui-checked': { color: '#5B6DC6' } }}
                  />
                  <Typography sx={{ fontSize: '13px', color: '#2F3C8C', fontWeight: isSelected ? 600 : 400 }}>
                    {team.name}
                  </Typography>
                </Box>
              )
            })
          )}
        </Box>

        {/* ボタン */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              backgroundColor: 'transparent',
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              height: '40px',
              fontSize: '13px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#E0E3F5', borderColor: '#5B6DC6' },
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={selected.length === 0}
            onClick={() => handleAdd(onClose)}
            sx={{
              height: '40px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: '#3949AB',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#2F3C8C', boxShadow: 'none' },
            }}
          >
            追加
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
