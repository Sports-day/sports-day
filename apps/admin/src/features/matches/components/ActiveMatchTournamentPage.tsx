import { Box, Breadcrumbs, Card, CardContent, Divider, Typography } from '@mui/material'
import { ButtonBase } from '@mui/material'
import { BREADCRUMB_LINK_SX, BREADCRUMB_CURRENT_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { showToast } from '@/lib/toast'
import { useTournamentDetail } from '@/features/competitions/hooks/useTournamentDetail'
import { TournamentBracketView } from '@/features/competitions/components/TournamentBracketView'
import { TournamentMatchEditDialog } from './TournamentMatchEditDialog'
import { useTournamentMatchEdit } from '../hooks/useTournamentMatchEdit'

type Props = {
  competitionName: string
  tournamentId: string
  tournamentName: string
  onBackToList: () => void
  onBackToCompetition: () => void
}

export function ActiveMatchTournamentPage({
  competitionName: _competitionName,
  tournamentId,
  tournamentName,
  onBackToList,
  onBackToCompetition: _onBackToCompetition,
}: Props) {
  const data = useTournamentDetail(tournamentId, tournamentName)
  const sortedBrackets = [...data.brackets].sort((a, b) => a.displayOrder - b.displayOrder)

  const { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch } =
    useTournamentMatchEdit()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          試合
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{tournamentName}</Typography>
      </Breadcrumbs>

      <Card elevation={0} sx={{ background: CARD_GRADIENT }}>
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
        onSave={() => { saveMatch(); showToast('試合を保存しました') }}
      />
    </Box>
  )
}
