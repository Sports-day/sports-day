import { LocationListPage, LocationCreatePage, LocationDetailPage } from '@/features/locations'
import { useState } from 'react'

type View = 'list' | 'create' | 'detail'

export default function LocationsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')

  if (view === 'create') {
    return (
      <LocationCreatePage
        onBack={() => setView('list')}
        onSave={() => setView('list')}
      />
    )
  }

  if (view === 'detail') {
    return (
      <LocationDetailPage
        locationId={selectedId}
        onBack={() => setView('list')}
        onSave={() => setView('list')}
        onDelete={() => setView('list')}
      />
    )
  }

  return (
    <LocationListPage
      onNavigateToCreate={() => setView('create')}
      onSelectLocation={(id) => {
        setSelectedId(id)
        setView('detail')
      }}
    />
  )
}
