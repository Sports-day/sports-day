import { useParams, useNavigate } from 'react-router-dom'
import { ImageDetailPage as ImageDetail } from '@/features/images'

export default function ImageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/images', { replace: true }); return null }
  return (
    <ImageDetail
      imageId={id}
      onBack={() => navigate('/images')}
    />
  )
}
