import { useMemo, useCallback } from 'react'
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
import { QueryError } from '@/components/ui/QueryError'
import { LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX, CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { useFilterParams } from '@/hooks/useFilterParams'

type Props = {
  onExport: () => void
  onBulkRename: () => void
  onTeamClick: (id: string) => void
}

export function TeamListPage({ onExport, onBulkRename, onTeamClick }: Props) {
  const { data: teams, loading, error } = useTeams()
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'group'])
  const keyword = fp.keyword
  const groupFilter = fp.group

  const groupOptions = useMemo(() => {
    const set = new Map<string, string>()
    for (const t of teams) {
      if (t.groupName && !set.has(t.groupName)) set.set(t.groupName, t.groupName)
    }
    return Array.from(set, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [teams])

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'group', label: 'クラス', options: groupOptions },
  ], [groupOptions])

  const filterValues = useMemo(() => ({ group: groupFilter }), [groupFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  const filtered = useMemo(() => {
    let result = teams
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(kw) ||
        t.groupName.toLowerCase().includes(kw)
      )
    }
    if (groupFilter) result = result.filter(t => t.groupName === groupFilter)
    return result
  }, [teams, keyword, groupFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        チーム
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="チーム名・クラス名で検索…"
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
                <TableCell sx={LIST_TABLE_HEAD_SX}>チーム名</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>クラス</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>タグ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    {keyword || groupFilter ? '条件に一致するチームがありません' : 'データがありません'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((team) => (
                  <TableRow
                    key={team.id}
                    hover
                    onClick={() => onTeamClick(team.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#E5E6F0' } }}
                  >
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
