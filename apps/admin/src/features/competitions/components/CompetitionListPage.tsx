import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCompetitions } from '../hooks/useCompetitions'
import { CompetitionCard } from './CompetitionCard'
import { CARD_GRADIENT, ACTION_BUTTON_SX } from '@/styles/commonSx'

type Props = {
  onNavigateToCreate: () => void
  onSelectCompetition: (id: string, name: string, type: string) => void
}

export function CompetitionListPage({ onNavigateToCreate, onSelectCompetition }: Props) {
  const { data: competitions, loading, error } = useCompetitions()

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
  if (error) return <Typography sx={{ color: '#D71212', mt: 2 }}>データの取得に失敗しました</Typography>

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        大会
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
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

          {competitions.length === 0 ? (
            <Typography sx={{ py: 8, color: '#888', fontSize: '13px', textAlign: 'center' }}>
              データがありません
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {competitions.map((competition) => (
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
