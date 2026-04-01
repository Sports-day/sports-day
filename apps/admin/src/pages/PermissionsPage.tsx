import { useState } from 'react'
import { PermissionsPage as PermissionsFeaturePage, RoleCreatePage, RoleDetailPage } from '@/features/permissions'

type View = 'list' | 'create' | 'detail'

export default function PermissionsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState('')

  if (view === 'create') {
    return <RoleCreatePage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return <RoleDetailPage roleId={selectedId} onBack={() => setView('list')} />
  }

  return (
    <PermissionsFeaturePage
      onCreateClick={() => setView('create')}
      onRoleClick={(id) => { setSelectedId(id); setView('detail') }}
    />
  )
}
