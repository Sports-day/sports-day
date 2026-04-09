import { useState, useCallback } from 'react'
import { ClassListPage, ClassCreatePage, ClassDetailPage } from '@/features/classes'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function ClassesPage() {
  const [view, setView] = useState<View>('list')
  const [selectedClassId, setSelectedClassId] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return <ClassCreatePage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return <ClassDetailPage classId={selectedClassId} onBack={() => setView('list')} />
  }

  return (
    <ClassListPage
      onCreateClick={() => setView('create')}
      onClassClick={(id) => { setSelectedClassId(id); setView('detail') }}
    />
  )
}
