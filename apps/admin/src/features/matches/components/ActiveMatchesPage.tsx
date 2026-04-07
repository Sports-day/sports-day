import { useState, useCallback } from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import { useCompetitions } from '@/features/competitions'
import type { Competition } from '@/features/competitions'
import { ActiveMatchLeaguePage } from './ActiveMatchLeaguePage'
import { ActiveMatchTournamentPage } from './ActiveMatchTournamentPage'
import { CARD_GRADIENT } from '@/styles/commonSx'
import { useResetToList } from '@/hooks/useResetToList'

type View =
  | { type: 'list' }
  | { type: 'league'; competitionId: string; competitionName: string; leagueId: string; leagueName: string }
  | { type: 'tournament'; competitionId: string; competitionName: string; tournamentId: string; tournamentName: string }

export function ActiveMatchesPage() {
  const [view, setView] = useState<View>({ type: 'list' })

  useResetToList(view.type === 'list', useCallback(() => setView({ type: 'list' }), []))
  const { data: competitions } = useCompetitions()

  const handleSelectCompetition = (competition: Competition) => {
    if (competition.type === 'LEAGUE') {
      setView({
        type: 'league',
        competitionId: competition.id,
        competitionName: competition.name,
        leagueId: competition.id,
        leagueName: competition.name,
      })
    } else if (competition.type === 'TOURNAMENT') {
      setView({
        type: 'tournament',
        competitionId: competition.id,
        competitionName: competition.name,
        tournamentId: competition.id,
        tournamentName: competition.name,
      })
    }
  }

  if (view.type === 'league') {
    return (
      <ActiveMatchLeaguePage
        competitionId={view.competitionId}
        competitionName={view.competitionName}
        leagueId={view.leagueId}
        leagueName={view.leagueName}
        onBackToList={() => setView({ type: 'list' })}
        onBackToCompetition={() => setView({ type: 'list' })}
      />
    )
  }

  if (view.type === 'tournament') {
    return (
      <ActiveMatchTournamentPage
        competitionName={view.competitionName}
        tournamentId={view.tournamentId}
        tournamentName={view.tournamentName}
        onBackToList={() => setView({ type: 'list' })}
        onBackToCompetition={() => setView({ type: 'list' })}
      />
    )
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#2F3C8C', mb: 2 }}>
        試合
      </Typography>

      <Card sx={{ background: CARD_GRADIENT }}>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2F3C8C', mb: 2 }}>
            大会から選ぶ
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1 }}>
            {competitions.map((competition) => (
              <Button
                key={competition.id}
                variant="text"
                onClick={() => handleSelectCompetition(competition)}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupsIcon sx={{ fontSize: 20, color: '#4A5ABB' }} />
                  <Typography sx={{ fontSize: '14px', color: '#2F3C8C', fontWeight: 400 }}>
                    {competition.name}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
