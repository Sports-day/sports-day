import { useMemo } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCompetitions } from '../hooks/useCompetitions'
import { QueryError } from '@/components/ui/QueryError'
import { CompetitionCard } from './CompetitionCard'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { DragHandle } from '@/components/ui/DragHandle'
import { useDisplayOrderDnD } from '@/hooks/useDisplayOrderDnD'
import { useUpdateAdminCompetitionsDisplayOrderMutation } from '@/gql/__generated__/graphql'

type Props = {
  onNavigateToCreate: () => void
  onSelectCompetition: (id: string, name: string, type: string) => void
}

const TYPE_OPTIONS = [
  { value: 'LEAGUE', label: 'リーグ' },
  { value: 'TOURNAMENT', label: 'トーナメント' },
]

export function CompetitionListPage({ onNavigateToCreate, onSelectCompetition }: Props) {
  const {
    data: filtered,
    allData: competitions,
    keyword,
    typeFilter,
    sportFilter,
    sceneFilter,
    sportOptions,
    sceneOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error,
  } = useCompetitions()

  const hasFilter = !!(keyword || typeFilter || sportFilter || sceneFilter)

  const [reorderMutation] = useUpdateAdminCompetitionsDisplayOrderMutation({
    refetchQueries: ['GetAdminCompetitions'],
    awaitRefetchQueries: true,
  })

  const {
    displayItems,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDisplayOrderDnD(competitions, (input) => reorderMutation({ variables: { input } }))

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

  const renderItems = hasFilter ? filtered : displayItems

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

          {renderItems.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              {hasFilter ? '条件に一致する大会がありません' : 'データがありません'}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {renderItems.map((competition, index) => (
                <Box
                  key={competition.id}
                  draggable={!hasFilter}
                  onDragStart={() => !hasFilter && handleDragStart(index)}
                  onDragOver={(e) => !hasFilter && handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    opacity: dragIndex === index ? 0.5 : 1,
                    borderLeft: dragOverIndex === index && dragIndex !== index ? '3px solid #3949AB' : '3px solid transparent',
                  }}
                >
                  <CompetitionCard
                    competition={competition}
                    onSelect={() => onSelectCompetition(competition.id, competition.name, competition.type)}
                    dragHandle={<DragHandle disabled={hasFilter} />}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
