import { useState } from 'react'
import { InformationListPage, InformationCreatePage, InformationDetailPage } from '@/features/information'

type View = 'list' | 'create' | 'detail'

export default function InformationPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')

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
