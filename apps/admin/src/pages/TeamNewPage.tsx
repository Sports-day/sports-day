import { useNavigate } from 'react-router-dom'
import { TeamCreatePage } from '@/features/teams'

export default function TeamNewPage() {
  const navigate = useNavigate()
  return (
    <TeamCreatePage
      onBack={() => navigate('/teams')}
      onSave={(id) => navigate(`/teams/${id}`)}
    />
  )
}
