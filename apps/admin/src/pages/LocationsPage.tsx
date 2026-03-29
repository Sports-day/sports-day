import { useState } from 'react'
import { LocationListPage, LocationCreatePage, LocationDetailPage, useLocations } from '@/features/locations'

type View = 'list' | 'create' | 'detail'

export default function LocationsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')
  const { data: locations } = useLocations()

  const selectedLocation = locations.find(l => l.id === selectedId)

  if (view === 'create') {
    return (
      <LocationCreatePage
        onBack={() => setView('list')}
        onSave={() => setView('list')}
      />
    )
  }

  if (view === 'detail' && selectedLocation) {
    return (
      <LocationDetailPage
        location={selectedLocation}
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
