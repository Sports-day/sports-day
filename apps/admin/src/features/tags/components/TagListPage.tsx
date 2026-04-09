import { useMemo, useCallback } from 'react'
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
import { QueryError } from '@/components/ui/QueryError'
import { CARD_GRADIENT, ACTION_BUTTON_SX, LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { useFilterParams } from '@/hooks/useFilterParams'

type Props = {
  onCreateClick: () => void
  onTagClick: (id: string) => void
}

const STATUS_OPTIONS = [
  { value: 'active', label: '有効' },
  { value: 'deleted', label: '無効' },
]

export function TagListPage({ onCreateClick, onTagClick }: Props) {
  const { data: tags, loading, error } = useTags()
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'status'])
  const keyword = fp.keyword
  const statusFilter = fp.status

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'status', label: '状態', options: STATUS_OPTIONS },
  ], [])

  const filterValues = useMemo(() => ({ status: statusFilter }), [statusFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  const filtered = useMemo(() => {
    let result = tags
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(kw))
    }
    if (statusFilter === 'active') result = result.filter(t => !t.isDeleted)
    if (statusFilter === 'deleted') result = result.filter(t => t.isDeleted)
    return result
  }, [tags, keyword, statusFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        タグ
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="タグ名で検索…"
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
                <TableCell sx={LIST_TABLE_HEAD_SX}>名前</TableCell>
                <TableCell sx={LIST_TABLE_HEAD_SX}>状態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                    {keyword || statusFilter ? '条件に一致するタグがありません' : 'データがありません'}
                  </TableCell>
                </TableRow>
              ) : filtered.map((tag) => (
                <TableRow key={tag.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                  <TableCell
                    sx={{ ...LIST_TABLE_CELL_SX, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => onTagClick(tag.id)}
                  >
                    {tag.name}
                  </TableCell>
                  <TableCell sx={LIST_TABLE_CELL_SX}>
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
