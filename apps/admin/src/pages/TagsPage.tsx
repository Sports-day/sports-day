import { useState, useCallback } from 'react'
import { TagListPage, TagCreatePage, TagDetailPage } from '@/features/tags'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function TagsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedTagId, setSelectedTagId] = useState('')

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return <TagCreatePage onBack={() => setView('list')} />
  }

  if (view === 'detail') {
    return <TagDetailPage tagId={selectedTagId} onBack={() => setView('list')} />
  }

  return (
    <TagListPage
      onCreateClick={() => setView('create')}
      onTagClick={(id) => { setSelectedTagId(id); setView('detail') }}
    />
  )
}
