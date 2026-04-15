import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SportsIcon from '@mui/icons-material/Sports'
import DescriptionIcon from '@mui/icons-material/Description'
import { useSports } from '../hooks/useSports'
import { useCompetitions } from '@/features/competitions/hooks/useCompetitions'
import { QueryError } from '@/components/ui/QueryError'
import { PdfExportDialog } from '@/features/competitions/components/PdfExportDialog'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'
import { SearchFilterBar, type FilterDef } from '@/components/ui/SearchFilterBar'
import { DragHandle } from '@/components/ui/DragHandle'
import { useDisplayOrderDnD } from '@/hooks/useDisplayOrderDnD'
import { useUpdateAdminSportsDisplayOrderMutation } from '@/gql/__generated__/graphql'

type Props = {
  onNavigateToCreate: () => void
  onSelectSport: (id: string) => void
}

export function SportListPage({ onNavigateToCreate, onSelectSport }: Props) {
  const {
    data: filtered,
    allData: sports,
    keyword,
    sceneFilter,
    sceneOptions,
    setFilter,
    handleFilterChange,
    resetFilters,
    loading,
    error,
  } = useSports()
  const { allData: competitions } = useCompetitions()
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfSportId, setPdfSportId] = useState('')
  const [pdfSceneId, setPdfSceneId] = useState('')

  const hasFilter = !!(keyword || sceneFilter)

  const [reorderMutation] = useUpdateAdminSportsDisplayOrderMutation({
    refetchQueries: ['GetAdminSports'],
    awaitRefetchQueries: true,
  })

  const {
    displayItems,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDisplayOrderDnD(sports, (input) => reorderMutation({ variables: { input } }))

  const sportScenePairs = useMemo(() => {
    const map = new Map<string, { sportId: string; sceneId: string; sportName: string; sceneName: string }>()
    for (const c of competitions) {
      if (c.type !== 'LEAGUE') continue
      const key = `${c.sportId}__${c.sceneId}`
      if (!map.has(key)) map.set(key, { sportId: c.sportId, sceneId: c.sceneId, sportName: c.sportName, sceneName: c.sceneName })
    }
    return [...map.values()].sort((a, b) => a.sportName.localeCompare(b.sportName) || a.sceneName.localeCompare(b.sceneName))
  }, [competitions])

  const handleOpenPdf = () => {
    if (sportScenePairs.length === 1) {
      setPdfSportId(sportScenePairs[0].sportId)
      setPdfSceneId(sportScenePairs[0].sceneId)
      setPdfDialogOpen(true)
    } else if (pdfSportId && pdfSceneId) {
      setPdfDialogOpen(true)
    }
  }

  const filterDefs: FilterDef[] = useMemo(() => [
    { key: 'scene', label: 'シーン', options: sceneOptions },
  ], [sceneOptions])

  const filterValues = useMemo(() => ({ scene: sceneFilter }), [sceneFilter])

  const renderItems = hasFilter ? filtered : displayItems

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
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
            {sportScenePairs.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                {sportScenePairs.length > 1 && (
                  <TextField
                    select
                    size="small"
                    value={pdfSportId && pdfSceneId ? `${pdfSportId}__${pdfSceneId}` : ''}
                    onChange={(e) => {
                      const [sid, scid] = e.target.value.split('__')
                      setPdfSportId(sid)
                      setPdfSceneId(scid)
                    }}
                    sx={{
                      minWidth: 180,
                      '& .MuiOutlinedInput-root': {
                        fontSize: '13px',
                        '& fieldset': { borderColor: '#5B6DC6' },
                      },
                      '& .MuiInputBase-input': { color: '#2F3C8C', py: '6px' },
                    }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '13px' }}>競技・シーンを選択</MenuItem>
                    {sportScenePairs.map((p) => (
                      <MenuItem key={`${p.sportId}__${p.sceneId}`} value={`${p.sportId}__${p.sceneId}`} sx={{ fontSize: '13px' }}>
                        {p.sportName} / {p.sceneName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <Button
                  variant="text"
                  size="small"
                  startIcon={<DescriptionIcon />}
                  onClick={handleOpenPdf}
                  disabled={sportScenePairs.length > 1 && (!pdfSportId || !pdfSceneId)}
                  sx={{
                    backgroundColor: '#EFF0F8',
                    color: '#2F3C8C',
                    fontSize: '13px',
                    borderRadius: 1,
                    px: 1.5,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#E5E6F0', boxShadow: 'none' },
                  }}
                >
                  資料を出力
                </Button>
              </Box>
            )}
          </Box>

          {renderItems.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              {keyword || sceneFilter ? '条件に一致する競技がありません' : 'データがありません'}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {renderItems.map((sport, index) => (
                <Box
                  key={sport.id}
                  draggable={!hasFilter}
                  onDragStart={() => !hasFilter && handleDragStart(index)}
                  onDragOver={(e) => !hasFilter && handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    opacity: dragIndex === index ? 0.5 : 1,
                    borderLeft: dragOverIndex === index && dragIndex !== index ? '3px solid #3949AB' : '3px solid transparent',
                  }}
                >
                  <Button
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', overflow: 'hidden' }}>
                      <DragHandle disabled={hasFilter} />
                      {sport.imageUrl ? (
                        <Box
                          component="img"
                          src={sport.imageUrl}
                          sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0 }}
                        />
                      ) : (
                        <SportsIcon sx={{ fontSize: 20, color: '#4A5ABB', flexShrink: 0 }} />
                      )}
                      <Typography noWrap sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 400, minWidth: 0 }}>
                        {sport.name}
                      </Typography>
                    </Box>
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <PdfExportDialog
        open={pdfDialogOpen}
        onClose={() => setPdfDialogOpen(false)}
        sportId={pdfSportId}
        sceneId={pdfSceneId}
      />
    </Box>
  )
}
