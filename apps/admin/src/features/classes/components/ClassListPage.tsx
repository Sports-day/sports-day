import AddIcon from '@mui/icons-material/Add'
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
import { useClasses } from '../hooks/useClasses'
import { QueryError } from '@/components/ui/QueryError'
import { CARD_GRADIENT, ACTION_BUTTON_SX, LIST_TABLE_HEAD_SX, LIST_TABLE_CELL_SX } from '@/styles/commonSx'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'

type Props = {
  onCreateClick: () => void
  onClassClick: (id: string) => void
}

export function ClassListPage({ onCreateClick, onClassClick }: Props) {
  const { data: filtered, keyword, setFilter, loading, error } = useClasses()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        クラス
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="クラス名で検索…"
          resultCount={filtered.length}
        />
      </Box>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべてのクラス
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onCreateClick}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              クラスを新規作成
            </Button>
          </Box>

          <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflowX: 'auto' }}>
            <Table size="small" sx={{ backgroundColor: '#FFFFFF', borderRadius: 1, overflow: 'hidden', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>クラス名</TableCell>
                  <TableCell sx={LIST_TABLE_HEAD_SX}>メンバー数</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 8, color: '#888', fontSize: '13px', backgroundColor: '#FFFFFF' }}>
                      {keyword ? '条件に一致するクラスがありません' : 'データがありません'}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((cls) => (
                  <TableRow key={cls.id} hover sx={{ '&:hover': { backgroundColor: '#E5E6F0' } }}>
                    <TableCell
                      sx={{ ...LIST_TABLE_CELL_SX, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => onClassClick(cls.id)}
                    >
                      {cls.name}
                    </TableCell>
                    <TableCell sx={LIST_TABLE_CELL_SX}>{cls.memberCount}人</TableCell>
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
