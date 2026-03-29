import { Box, Breadcrumbs, Button, Card, CardContent, Typography } from '@mui/material'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { MOCK_LEAGUES_BY_COMPETITION } from '../mock'

const LEAGUE_BUTTON_SX = {
  backgroundColor: '#EFF0F8',
  width: '100%',
  height: 50,
  borderRadius: 1,
  justifyContent: 'flex-start',
  px: 2,
  fontSize: '16px',
  fontWeight: 400,
  color: '#2F3C8C',
  '&.MuiButton-root': { border: 'none', outline: 'none' },
  '&:hover': { backgroundColor: '#E5E6F0' },
}

type Props = {
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onNavigateToLeague: (leagueId: string, leagueName: string) => void
  onNavigateToLeagueCreate: () => void
}

export function CompetitionDetailPage({ competitionId, competitionName, onBackToList, onNavigateToLeague, onNavigateToLeagueCreate }: Props) {
  const leagues = MOCK_LEAGUES_BY_COMPETITION[competitionId] ?? []

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <Typography sx={BREADCRUMB_LINK_SX} onClick={onBackToList}>
          競技
        </Typography>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {competitionName}
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px', color: '#2F3C8C', px: 1 }}>
              リーグ一覧
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={onNavigateToLeagueCreate}
              sx={{
                backgroundColor: '#EFF0F8',
                color: '#2F3C8C',
                '&.MuiButton-root': { border: 'none', outline: 'none' },
                '&:hover': { backgroundColor: '#E5E6F0' },
              }}
            >
              リーグを作成
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
            {leagues.map(league => (
              <Button key={league.id} variant="text" onClick={() => onNavigateToLeague(league.id, league.name)} sx={LEAGUE_BUTTON_SX}>
                {league.name}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
