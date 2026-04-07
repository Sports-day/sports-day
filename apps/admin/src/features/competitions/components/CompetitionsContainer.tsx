import { useState, useCallback } from 'react'
import { CompetitionListPage } from './CompetitionListPage'
import { CompetitionCreatePage } from './CompetitionCreatePage'
import { LeagueDetailPage } from './LeagueDetailPage'
import { TournamentDetailPage } from './TournamentDetailPage'
import { CompetitionType } from '@/gql/__generated__/graphql'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'league-detail' | 'tournament-detail'

export function CompetitionsContainer() {
  const [view, setView] = useState<View>('list')
  const [competitionId, setCompetitionId] = useState('')
  const [competitionName, setCompetitionName] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'league-detail') {
    return (
      <LeagueDetailPage
        leagueId={competitionId}
        leagueName={competitionName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('list')}
        onSaved={(newName) => setCompetitionName(newName)}
        onDeleted={() => setView('list')}
      />
    )
  }

  if (view === 'tournament-detail') {
    return (
      <TournamentDetailPage
        tournamentId={competitionId}
        tournamentName={competitionName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('list')}
        onSaved={(newName) => setCompetitionName(newName)}
        onDeleted={() => setView('list')}
      />
    )
  }

  if (view === 'create') {
    return (
      <CompetitionCreatePage
        onBack={() => setView('list')}
        onSave={(id, name, type) => {
          setCompetitionId(id)
          setCompetitionName(name)
          if (type === CompetitionType.League) {
            setView('league-detail')
          } else {
            setView('tournament-detail')
          }
        }}
      />
    )
  }

  return (
    <CompetitionListPage
      onNavigateToCreate={() => setView('create')}
      onSelectCompetition={(id, name, type) => {
        setCompetitionId(id)
        setCompetitionName(name)
        if (type === 'LEAGUE') {
          setView('league-detail')
        } else {
          setView('tournament-detail')
        }
      }}
    />
  )
}
