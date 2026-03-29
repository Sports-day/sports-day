import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, Typography } from '@mui/material'
import { MOCK_ACTIVE_LEAGUES } from '../mock'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

const LEAGUE_BUTTON_SX = {
  backgroundColor: '#EFF0F8',
  width: '100%',
  height: 50,
  borderRadius: 1,
  justifyContent: 'flex-start',
  px: 2,
  fontSize: '14px',
  fontWeight: 400,
  color: '#2F3C8C',
  '&.MuiButton-root': { border: 'none', outline: 'none' },
  '&:hover': { backgroundColor: '#E5E6F0' },
  '&:focus-visible': { outline: 'none' },
}

type Props = {
  competitionId: string
  competitionName: string
  onBack: () => void
  onSelectLeague: (leagueId: string, leagueName: string) => void
}

export function ActiveMatchCompetitionPage({ competitionId, competitionName, onBack, onSelectLeague }: Props) {
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []

  return (
    <Box>
      <Breadcrumbs separator="/" sx={{ mb: 2 }}>
        <ButtonBase onClick={onBack} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>
          {competitionName}
        </Typography>
      </Breadcrumbs>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '14px', color: '#2F3C8C', px: 1, mb: 2 }}>
            リーグ一覧
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
            {leagues.map((league) => (
              <Button
                key={league.id}
                variant="text"
                onClick={() => onSelectLeague(league.id, league.name)}
                sx={LEAGUE_BUTTON_SX}
              >
                {league.name}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
