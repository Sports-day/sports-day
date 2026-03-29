import { useState } from 'react'
import { CompetitionListPage } from './CompetitionListPage'
import { CompetitionCreatePage } from './CompetitionCreatePage'
import { CompetitionDetailPage } from './CompetitionDetailPage'
import { LeagueDetailPage } from './LeagueDetailPage'
import { LeagueCreatePage } from './LeagueCreatePage'

type View = 'list' | 'create' | 'detail' | 'league-detail' | 'league-create'

export function CompetitionsContainer() {
  const [view, setView] = useState<View>('list')
  const [competitionId, setCompetitionId] = useState('')
  const [competitionName, setCompetitionName] = useState('')
  const [leagueId, setLeagueId] = useState('')
  const [leagueName, setLeagueName] = useState('')

  if (view === 'league-create') {
    return (
      <LeagueCreatePage
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
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('detail')}
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
        onNavigateToLeagueCreate={() => setView('league-create')}
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
