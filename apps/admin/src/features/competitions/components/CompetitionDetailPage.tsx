import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  BREADCRUMB_LINK_SX,
  BREADCRUMB_CURRENT_SX,
  CARD_GRADIENT,
  ACTION_BUTTON_SX,
} from '@/styles/commonSx'
import { MOCK_LEAGUES_BY_COMPETITION, MOCK_TOURNAMENTS_BY_COMPETITION } from '../mock'

const ENTRY_BUTTON_SX = {
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
  onNavigateToTournament: (tournamentId: string, tournamentName: string) => void
  onNavigateToLeagueCreate: () => void
  onNavigateToTournamentCreate: () => void
}

export function CompetitionDetailPage({
  competitionId,
  competitionName,
  onBackToList,
  onNavigateToLeague,
  onNavigateToTournament,
  onNavigateToLeagueCreate,
  onNavigateToTournamentCreate,
}: Props) {
  const leagues = MOCK_LEAGUES_BY_COMPETITION[competitionId] ?? []
  const tournaments = MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] ?? []

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* リーグ一覧 */}
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600 }}>
                リーグ一覧
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onNavigateToLeagueCreate}
                sx={ACTION_BUTTON_SX}
              >
                リーグを作成
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {leagues.map(league => (
                <Button key={league.id} variant="text" onClick={() => onNavigateToLeague(league.id, league.name)} sx={ENTRY_BUTTON_SX}>
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
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 600 }}>
                トーナメント一覧
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onNavigateToTournamentCreate}
                sx={ACTION_BUTTON_SX}
              >
                トーナメントを作成
              </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
              {tournaments.map(tournament => (
                <Button key={tournament.id} variant="text" onClick={() => onNavigateToTournament(tournament.id, tournament.name)} sx={ENTRY_BUTTON_SX}>
                  {tournament.name}
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
