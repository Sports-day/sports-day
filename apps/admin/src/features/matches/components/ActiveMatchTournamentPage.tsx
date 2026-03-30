import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Divider, MenuItem, TextField, Typography } from '@mui/material'
import { ButtonBase } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT, SAVE_BUTTON_SX } from '@/styles/commonSx'
import { MOCK_TOURNAMENT_DETAILS } from '@/features/competitions/mock'
import { TournamentBracketView } from '@/features/competitions/components/TournamentBracketView'
import { TournamentMatchEditDialog } from './TournamentMatchEditDialog'
import { useTournamentMatchEdit } from '../hooks/useTournamentMatchEdit'
import { useSeedAssignment } from '../hooks/useSeedAssignment'

type Props = {
  competitionName: string
  tournamentId: string
  tournamentName: string
  onBackToList: () => void
  onBackToCompetition: () => void
}

export function ActiveMatchTournamentPage({
  competitionName,
  tournamentId,
  tournamentName,
  onBackToList,
  onBackToCompetition,
}: Props) {
  const data = MOCK_TOURNAMENT_DETAILS[tournamentId] ?? { id: tournamentId, name: tournamentName, brackets: [] }
  const sortedBrackets = [...data.brackets].sort((a, b) => a.displayOrder - b.displayOrder)

  const { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch } =
    useTournamentMatchEdit()

  const { seedNumbers, assignments, teams, version, setAssignment, saveAssignments } = useSeedAssignment(tournamentId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <ButtonBase onClick={onBackToCompetition} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tournamentName}</Typography>
      </Breadcrumbs>

      {seedNumbers.length > 0 && (
        <Card sx={{ background: CARD_GRADIENT }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmojiEventsIcon sx={{ fontSize: 18, color: '#2F3C8C' }} />
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
                シード割り当て
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {seedNumbers.map((seedNumber) => (
                <Box key={seedNumber} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`Seed ${seedNumber}`}
                    size="small"
                    sx={{ minWidth: 64, bgcolor: '#E8EAF6', color: '#3949AB', fontWeight: 700, fontSize: '12px' }}
                  />
                  <TextField
                    select
                    size="small"
                    value={assignments[seedNumber] ?? ''}
                    onChange={(e) => setAssignment(seedNumber, e.target.value)}
                    sx={{ flex: 1, maxWidth: 280, '& .MuiOutlinedInput-root': { backgroundColor: '#FFFFFF' } }}
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value=""><em style={{ color: '#9E9E9E' }}>未割当</em></MenuItem>
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                    ))}
                  </TextField>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={saveAssignments}
                sx={{ ...SAVE_BUTTON_SX, '& .MuiButton-startIcon': { color: '#FFFFFF' } }}
              >
                割り当てを保存
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 1 }}>
            ブラケット構成
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#5B6DC6', mb: 2 }}>
            試合カードをクリックするとスコアを入力できます
          </Typography>

          {sortedBrackets.length === 0 && (
            <Typography sx={{ fontSize: '13px', color: '#2F3C8C', opacity: 0.5 }}>
              ブラケットがありません
            </Typography>
          )}

          {sortedBrackets.map((bracket, idx) => (
            <Box key={bracket.id}>
              {idx > 0 && <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 3 }} />}
              <TournamentBracketView
                key={`${bracket.id}-${version}`}
                bracket={bracket}
                onMatchClick={(match) => openMatch(match, tournamentId)}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      <TournamentMatchEditDialog
        open={!!selectedMatch}
        match={selectedMatch}
        tournamentName={tournamentName}
        score1={score1}
        score2={score2}
        status={status}
        onScore1Change={setScore1}
        onScore2Change={setScore2}
        onStatusChange={setStatus}
        onClose={closeMatch}
        onSave={saveMatch}
      />
    </Box>
  )
}
