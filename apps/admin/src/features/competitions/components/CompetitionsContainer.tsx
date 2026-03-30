import { useState } from 'react'
import { CompetitionListPage } from './CompetitionListPage'
import { CompetitionCreatePage } from './CompetitionCreatePage'
import { CompetitionDetailPage } from './CompetitionDetailPage'
import { LeagueDetailPage } from './LeagueDetailPage'
import { LeagueCreatePage } from './LeagueCreatePage'
import { TournamentCreatePage } from './TournamentCreatePage'
import { TournamentDetailPage } from './TournamentDetailPage'
import { TournamentEditPage } from './TournamentEditPage'

type View = 'list' | 'create' | 'detail' | 'league-detail' | 'league-create' | 'tournament-create' | 'tournament-detail' | 'tournament-edit'

export function CompetitionsContainer() {
  const [view, setView] = useState<View>('list')
  const [competitionId, setCompetitionId] = useState('')
  const [competitionName, setCompetitionName] = useState('')
  const [leagueId, setLeagueId] = useState('')
  const [leagueName, setLeagueName] = useState('')
  const [tournamentId, setTournamentId] = useState('')
  const [tournamentName, setTournamentName] = useState('')

  if (view === 'league-create') {
    return (
      <LeagueCreatePage
        type="league"
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
        onSave={() => setView('detail')}
      />
    )
  }

  if (view === 'tournament-create') {
    return (
      <TournamentCreatePage
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
        onSave={() => setView('detail')}
      />
    )
  }

  if (view === 'league-detail') {
    return (
      <LeagueDetailPage
        leagueId={leagueId}
        leagueName={leagueName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
      />
    )
  }

  if (view === 'tournament-detail') {
    return (
      <TournamentDetailPage
        tournamentId={tournamentId}
        tournamentName={tournamentName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
        onNavigateToEdit={() => setView('tournament-edit')}
      />
    )
  }

  if (view === 'tournament-edit') {
    return (
      <TournamentEditPage
        tournamentId={tournamentId}
        tournamentName={tournamentName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
        onDeleted={() => setView('detail')}
      />
    )
  }

  if (view === 'detail') {
    return (
      <CompetitionDetailPage
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onNavigateToLeague={(id, name) => {
          setLeagueId(id)
          setLeagueName(name)
          setView('league-detail')
        }}
        onNavigateToTournament={(id, name) => {
          setTournamentId(id)
          setTournamentName(name)
          setView('tournament-detail')
        }}
        onNavigateToLeagueCreate={() => setView('league-create')}
        onNavigateToTournamentCreate={() => setView('tournament-create')}
      />
    )
  }

  if (view === 'create') {
    return (
      <CompetitionCreatePage
        onBack={() => setView('list')}
        onSave={() => setView('list')}
      />
    )
  }

  return (
    <CompetitionListPage
      onNavigateToCreate={() => setView('create')}
      onSelectCompetition={(id, name) => {
        setCompetitionId(id)
        setCompetitionName(name)
        setView('detail')
      }}
    />
  )
}
