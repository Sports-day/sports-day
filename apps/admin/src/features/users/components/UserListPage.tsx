import { useMemo } from 'react'
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
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useUsers } from '../hooks/useUsers'
import { QueryError } from '@/components/ui/QueryError'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'

type Props = {
  onCsvCreate: () => void
  onUserClick: (id: string) => void
}

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: '管理者' },
  { value: 'ORGANIZER', label: '運営' },
  { value: 'PARTICIPANT', label: '参加者' },
]

export function UserListPage({ onCsvCreate, onUserClick }: Props) {
  const {
    data: filtered,
    keyword,
    roleFilter,
    groupFilter,
    groupOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error,
  } = useUsers()

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'role', label: 'ロール', options: ROLE_OPTIONS },
    { key: 'group', label: 'クラス', options: groupOptions },
  ], [groupOptions])

  const filterValues = useMemo(() => ({
    role: roleFilter,
    group: groupFilter,
  }), [roleFilter, groupFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        ユーザー
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="名前・メール・チーム名で検索…"
          filters={filterDefs}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          resultCount={filtered.length}
          onReset={resetFilters}
        />
      </Box>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのユーザー
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<UploadFileIcon />}
              onClick={onCsvCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              CSVで一括作成
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
          <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={LIST_TABLE_HEAD_SX}>学籍番号</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>メール名</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>クラス</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>チーム名</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>経験者</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    {keyword || roleFilter || groupFilter ? '条件に一致するユーザーがありません' : 'データがありません'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => {
                  const cellSx = { ...LIST_TABLE_CELL_SX, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }
                  return (
                    <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }} onClick={() => onUserClick(user.id)}>
                      <TableCell sx={cellSx}>{user.studentNumber}</TableCell>
                      <TableCell sx={cellSx}>{user.name}</TableCell>
                      <TableCell sx={cellSx}>{user.email}</TableCell>
                      <TableCell sx={cellSx}>{user.groupName}</TableCell>
                      <TableCell sx={cellSx}>{user.teams.map(t => t.name).join(', ')}</TableCell>
                      <TableCell sx={cellSx}>{user.experiencedSports.join(', ')}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
