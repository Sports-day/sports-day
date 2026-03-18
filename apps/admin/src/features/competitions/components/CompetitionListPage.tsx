import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCompetitions } from '../hooks/useCompetitions'
import { CompetitionCard } from './CompetitionCard'

export function CompetitionListPage() {
  const { data: competitions } = useCompetitions()

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        競技
      </Typography>

      <Card sx={{ background: 'linear-gradient(to bottom, #E0E3F5 0%, #D3D7EE 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              競技一覧
            </Typography>
            <Button
              variant="text"
              size="small"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: '#EFF0F8', color: '#2F3C8C', '&:hover': { backgroundColor: '#E5E6F0' } }}
            >
              競技を新規作成
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
