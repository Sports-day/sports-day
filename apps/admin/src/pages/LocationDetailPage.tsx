import { useParams, useNavigate } from 'react-router-dom'
import { LocationDetailPage as LocationDetail } from '@/features/locations'

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/locations', { replace: true }); return null }
  return (
    <LocationDetail
      locationId={id}
      onBack={() => navigate('/locations')}
      onSave={() => navigate('/locations')}
      onDelete={() => navigate('/locations')}
    />
  )
}
