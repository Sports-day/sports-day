import { useState, useCallback } from 'react'
import { InformationListPage, InformationCreatePage, InformationDetailPage } from '@/features/information'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function InformationPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return <InformationCreatePage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return (
      <InformationDetailPage
        announcementId={selectedId}
        onBack={() => setView('list')}
      />
    )
  }

  return (
    <InformationListPage
      onCreateClick={() => setView('create')}
      onAnnouncementClick={(id) => { setSelectedId(id); setView('detail') }}
    />
  )
}
