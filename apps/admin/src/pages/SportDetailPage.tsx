import { useParams, useNavigate } from 'react-router-dom'
import { SportDetailPage as SportDetail } from '@/features/sports'

export default function SportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/sports', { replace: true }); return null }
  return (
    <SportDetail
      sportId={id}
      onBack={() => navigate('/sports')}
      onDelete={() => navigate('/sports')}
    />
  )
}
