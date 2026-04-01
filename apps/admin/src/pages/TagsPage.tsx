import { useState } from 'react'
import { TagListPage, TagCreatePage, TagDetailPage } from '@/features/tags'

type View = 'list' | 'create' | 'detail'

export default function TagsPage() {
  const [view, setView] = useState<View>('list')
  const [selectedTagId, setSelectedTagId] = useState('')

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
