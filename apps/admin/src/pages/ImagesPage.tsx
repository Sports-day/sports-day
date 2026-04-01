import { useState } from 'react'
import { ImageListPage, ImageCreatePage, ImageDetailPage } from '@/features/images'

type View = 'list' | 'create' | 'detail'

export default function ImagesPage() {
  const [view, setView] = useState<View>('list')
  const [imageId, setImageId] = useState<string | null>(null)

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
