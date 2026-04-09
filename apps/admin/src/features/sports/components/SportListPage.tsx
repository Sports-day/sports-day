import { useMemo, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SportsIcon from '@mui/icons-material/Sports'
import { useSports } from '../hooks/useSports'
import { QueryError } from '@/components/ui/QueryError'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { useFilterParams } from '@/hooks/useFilterParams'

type Props = {
  onNavigateToCreate: () => void
  onSelectSport: (id: string) => void
}

export function SportListPage({ onNavigateToCreate, onSelectSport }: Props) {
  const { data: sports, loading, error } = useSports()
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'scene'])
  const keyword = fp.keyword
  const sceneFilter = fp.scene

  const sceneOptions = useMemo(() => {
    const set = new Set<string>()
    for (const s of sports) {
      for (const name of s.sceneNames) set.add(name)
    }
    return Array.from(set).sort().map(name => ({ value: name, label: name }))
  }, [sports])

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'scene', label: 'シーン', options: sceneOptions },
  ], [sceneOptions])

  const filterValues = useMemo(() => ({ scene: sceneFilter }), [sceneFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  const filtered = useMemo(() => {
    let result = sports
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(kw))
    }
    if (sceneFilter) result = result.filter(s => s.sceneNames.includes(sceneFilter))
    return result
  }, [sports, keyword, sceneFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        競技
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="競技名で検索…"
          filters={filterDefs}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          resultCount={filtered.length}
          onReset={resetFilters}
        />
      </Box>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              すべての競技
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onNavigateToCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              競技を新規作成
            </Button>
          </Box>

          {filtered.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              {keyword || sceneFilter ? '条件に一致する競技がありません' : 'データがありません'}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {filtered.map((sport) => (
                <Button
                  key={sport.id}
                  variant="text"
                  onClick={() => onSelectSport(sport.id)}
                  sx={{
                    backgroundColor: '#EFF0F8',
                    width: '100%',
                    height: 50,
                    borderRadius: 1,
                    justifyContent: 'flex-start',
                    px: 2,
                    '&.MuiButton-root': { border: 'none', outline: 'none' },
                    '&:hover': { backgroundColor: '#E5E6F0' },
                    '&:focus-visible': { outline: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {sport.imageUrl ? (
                      <Box
                        component="img"
                        src={sport.imageUrl}
                        sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover' }}
                      />
                    ) : (
                      <SportsIcon sx={{ fontSize: 20, color: '#4A5ABB' }} />
                    )}
                    <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 400 }}>
                      {sport.name}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
