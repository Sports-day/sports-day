import { useState, useCallback } from 'react'
import { TeamListPage, TeamExportPage, TeamBulkRenamePage, TeamDetailPage } from '@/features/teams'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'export' | 'bulkRename' | 'detail'

export default function TeamsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'export') {
    return <TeamExportPage onBack={() => setView('list')} />
  }

  if (view === 'bulkRename') {
    return <TeamBulkRenamePage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return <TeamDetailPage teamId={selectedTeamId} onBack={() => setView('list')} />
  }

  return (
    <TeamListPage
      onExport={() => setView('export')}
      onBulkRename={() => setView('bulkRename')}
      onTeamClick={(id) => { setSelectedTeamId(id); setView('detail') }}
    />
  )
}
