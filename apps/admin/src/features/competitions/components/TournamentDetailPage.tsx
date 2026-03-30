import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Divider, Typography } from '@mui/material'
import { ButtonBase } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { BREADCRUMB_CURRENT_SX, BREADCRUMB_LINK_SX, CARD_GRADIENT } from '@/styles/commonSx'
import { useTournamentDetail } from '../hooks/useTournamentDetail'
import { TournamentBracketView } from './TournamentBracketView'
import { TournamentMatchEditDialog } from '@/features/matches/components/TournamentMatchEditDialog'
import { useTournamentMatchEdit } from '@/features/matches/hooks/useTournamentMatchEdit'

type Props = {
  tournamentId: string
  tournamentName: string
  competitionId: string
  competitionName: string
  onBackToList: () => void
  onBackToDetail: () => void
  onNavigateToEdit?: () => void
}

export function TournamentDetailPage({
  tournamentId,
  tournamentName,
  competitionName,
  onBackToList,
  onBackToDetail,
  onNavigateToEdit,
}: Props) {
  const data = useTournamentDetail(tournamentId, tournamentName)
  const sortedBrackets = [...data.brackets].sort((a, b) => a.displayOrder - b.displayOrder)

  const { selectedMatch, score1, score2, status, setScore1, setScore2, setStatus, openMatch, closeMatch, saveMatch } =
    useTournamentMatchEdit()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs separator="/" sx={{ mb: 0 }}>
        <ButtonBase onClick={onBackToList} sx={BREADCRUMB_LINK_SX}>
          競技
        </ButtonBase>
        <ButtonBase onClick={onBackToDetail} sx={BREADCRUMB_LINK_SX}>
          {competitionName}
        </ButtonBase>
        <Typography sx={BREADCRUMB_CURRENT_SX}>{data.name}</Typography>
      </Breadcrumbs>

      {onNavigateToEdit && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onNavigateToEdit}
            sx={{
              color: '#2F3C8C',
              borderColor: '#5B6DC6',
              fontSize: '13px',
              '&:hover': { backgroundColor: '#E8EAF6', borderColor: '#5B6DC6' },
              '& .MuiButton-startIcon': { color: '#2F3C8C' },
            }}
          >
            トーナメント設定を編集
          </Button>
        </Box>
      )}

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <EmojiEventsIcon sx={{ fontSize: 18, color: '#2F3C8C' }} />
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C' }}>
              ブラケット構成
            </Typography>
            <Chip
              label={`${data.teamCount}チーム`}
              size="small"
              sx={{ bgcolor: '#E8EAF6', color: '#3949AB', fontWeight: 700, fontSize: '11px' }}
            />
          </Box>
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
              {idx > 0 && (
                <Divider sx={{ borderColor: '#5B6DC6', opacity: 0.3, my: 3 }} />
              )}
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
        tournamentName={data.name}
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
