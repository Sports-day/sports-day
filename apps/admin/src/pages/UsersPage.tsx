import { useState } from 'react'
import { UserListPage, UserCsvPage, UserDetailPage } from '@/features/users'

type View = 'list' | 'csv' | 'detail'

export default function UsersPage() {
  const [view, setView] = useState<View>('list')
  const [selectedUserId, setSelectedUserId] = useState('')

  if (view === 'csv') {
    return <UserCsvPage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return <UserDetailPage userId={selectedUserId} onBack={() => setView('list')} />
  }

  return (
    <UserListPage
      onCsvCreate={() => setView('csv')}
      onUserClick={(id) => { setSelectedUserId(id); setView('detail') }}
    />
  )
}
