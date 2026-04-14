import { useParams, useNavigate } from 'react-router-dom'
import { TeamDetailPage as TeamDetail } from '@/features/teams'

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/teams', { replace: true }); return null }
  return (
    <TeamDetail
      teamId={id}
      onBack={() => navigate('/teams')}
    />
  )
}
