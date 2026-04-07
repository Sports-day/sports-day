import { useState, useCallback } from 'react'
import { UserListPage, UserCsvPage, UserDetailPage } from '@/features/users'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'csv' | 'detail'

export default function UsersPage() {
  const [view, setView] = useState<View>('list')
  const [selectedUserId, setSelectedUserId] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

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
