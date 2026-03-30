import { Box, Breadcrumbs, ButtonBase, Button, Card, CardContent, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { MOCK_ACTIVE_LEAGUES } from '../mock'
import { MOCK_TOURNAMENTS_BY_COMPETITION } from '@/features/competitions/mock'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'

const ITEM_BUTTON_SX = {
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
  onSelectTournament: (tournamentId: string, tournamentName: string) => void
}

export function ActiveMatchCompetitionPage({ competitionId, competitionName, onBack, onSelectLeague, onSelectTournament }: Props) {
  const leagues = MOCK_ACTIVE_LEAGUES[competitionId] ?? []
  const tournaments = MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? []

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* リーグ一覧 */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent>
            <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600, mb: 2 }}>
              リーグ一覧
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {leagues.map((league) => (
                <Button
                  key={league.id}
                  variant="text"
                  onClick={() => onSelectLeague(league.id, league.name)}
                  sx={ITEM_BUTTON_SX}
                >
                  {league.name}
                </Button>
              ))}
              {leagues.length === 0 && (
                <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5, gridColumn: '1 / -1', py: 1 }}>
                  リーグがありません
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* トーナメント一覧 */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent>
            <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600, mb: 2 }}>
              トーナメント一覧
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {tournaments.map((tournament) => (
                <Button
                  key={tournament.id}
                  variant="text"
                  onClick={() => onSelectTournament(tournament.id, tournament.name)}
                  sx={ITEM_BUTTON_SX}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ fontSize: 16, color: '#4A5ABB' }} />
                    {tournament.name}
                  </Box>
                </Button>
              ))}
              {tournaments.length === 0 && (
                <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5, gridColumn: '1 / -1', py: 1 }}>
                  トーナメントがありません
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
