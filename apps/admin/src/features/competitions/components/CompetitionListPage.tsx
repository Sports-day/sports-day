import { useMemo, useCallback } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCompetitions } from '../hooks/useCompetitions'
import { QueryError } from '@/components/ui/QueryError'
import { CompetitionCard } from './CompetitionCard'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { useFilterParams } from '@/hooks/useFilterParams'

type Props = {
  onNavigateToCreate: () => void
  onSelectCompetition: (id: string, name: string, type: string) => void
}

const TYPE_OPTIONS = [
  { value: 'LEAGUE', label: 'リーグ' },
  { value: 'TOURNAMENT', label: 'トーナメント' },
]

export function CompetitionListPage({ onNavigateToCreate, onSelectCompetition }: Props) {
  const { data: competitions, loading, error } = useCompetitions()
  const { values: fp, set: setFilter, reset: resetFilters } = useFilterParams(['keyword', 'type', 'sport', 'scene'])
  const keyword = fp.keyword
  const typeFilter = fp.type
  const sportFilter = fp.sport
  const sceneFilter = fp.scene

  const sportOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of competitions) {
      if (!map.has(c.sportId)) map.set(c.sportId, c.sportName)
    }
    return Array.from(map, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
  }, [competitions])

  const sceneOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of competitions) {
      if (c.sceneName) set.add(c.sceneName)
    }
    return Array.from(set).sort().map(name => ({ value: name, label: name }))
  }, [competitions])

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'type', label: 'タイプ', options: TYPE_OPTIONS },
    { key: 'sport', label: '競技', options: sportOptions },
    { key: 'scene', label: 'シーン', options: sceneOptions },
  ], [sportOptions, sceneOptions])

  const filterValues = useMemo(() => ({
    type: typeFilter,
    sport: sportFilter,
    scene: sceneFilter,
  }), [typeFilter, sportFilter, sceneFilter])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  const filtered = useMemo(() => {
    let result = competitions
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(kw) ||
        c.sportName.toLowerCase().includes(kw) ||
        c.sceneName.toLowerCase().includes(kw)
      )
    }
    if (typeFilter) result = result.filter(c => c.type === typeFilter)
    if (sportFilter) result = result.filter(c => c.sportId === sportFilter)
    if (sceneFilter) result = result.filter(c => c.sceneName === sceneFilter)
    return result
  }, [competitions, keyword, typeFilter, sportFilter, sceneFilter])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <QueryError />

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        大会
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={(v) => setFilter('keyword', v)}
          placeholder="大会名・競技名で検索…"
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
              すべての大会
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onNavigateToCreate}
              sx={{ ...ACTION_BUTTON_SX }}
            >
              大会を新規作成
            </Button>
          </Box>

          {filtered.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              {keyword || typeFilter || sportFilter || sceneFilter ? '条件に一致する大会がありません' : 'データがありません'}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {filtered.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  onSelect={() => onSelectCompetition(competition.id, competition.name, competition.type)}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
