import { useState, useCallback } from 'react'
import { TeamListPage, TeamCreatePage, TeamDetailPage } from '@/features/teams'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function TeamsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return (
      <TeamCreatePage
        onBack={() => setView('list')}
        onSave={(id) => { setSelectedTeamId(id); setView('detail') }}
      />
    )
  }

  if (view === 'detail') {
    return <TeamDetailPage teamId={selectedTeamId} onBack={() => setView('list')} />
  }

  return (
    <TeamListPage
      onTeamClick={(id) => { setSelectedTeamId(id); setView('detail') }}
      onNavigateToCreate={() => setView('create')}
    />
  )
}
