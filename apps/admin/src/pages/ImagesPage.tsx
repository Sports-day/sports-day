import { useState } from 'react'
import { ImageListPage, ImageCreatePage } from '@/features/images'

type View = 'list' | 'create'

export default function ImagesPage() {
  const [view, setView] = useState<View>('list')

  if (view === 'create') {
    return <ImageCreatePage onBack={() => setView('list')} />
  }

  return <ImageListPage onCreateClick={() => setView('create')} />
}
