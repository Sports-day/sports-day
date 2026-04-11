import { SportListPage, SportCreatePage, SportDetailPage } from '@/features/sports'
import { useState, useCallback } from 'react'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function SportsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return (
      <SportCreatePage
        onBack={() => setView('list')}
        onSave={() => setView('list')}
      />
    )
  }

  if (view === 'detail') {
    return (
      <SportDetailPage
        sportId={selectedId}
        onBack={() => setView('list')}
        onDelete={() => setView('list')}
      />
    )
  }

  return (
    <SportListPage
      onNavigateToCreate={() => setView('create')}
      onSelectSport={(id) => {
        setSelectedId(id)
        setView('detail')
      }}
    />
  )
}
