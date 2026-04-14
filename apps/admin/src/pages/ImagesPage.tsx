import { useNavigate } from 'react-router-dom'
import { ImageListPage } from '@/features/images'

export default function ImagesPage() {
  const navigate = useNavigate()
  return (
    <ImageListPage
      onCreateClick={() => navigate('/images/new')}
      onImageClick={(id) => navigate(`/images/${id}`)}
    />
  )
}
