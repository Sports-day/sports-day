import { useState, useCallback } from 'react'
import { ImageListPage, ImageCreatePage, ImageDetailPage } from '@/features/images'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'detail'

export default function ImagesPage() {
  const [view, setView] = useState<View>('list')
  const [imageId, setImageId] = useState<string | null>(null)

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'create') {
    return <ImageCreatePage onBack={() => setView('list')} />
  }

  if (view === 'detail' && imageId) {
    return <ImageDetailPage imageId={imageId} onBack={() => setView('list')} />
  }

  return (
    <ImageListPage
      onCreateClick={() => setView('create')}
      onImageClick={(id) => { setImageId(id); setView('detail') }}
    />
  )
}
