import { useNavigate } from 'react-router-dom'
import { TeamListPage } from '@/features/teams'

export default function TeamsPage() {
  const navigate = useNavigate()
  return (
    <TeamListPage
      onNavigateToCreate={() => navigate('/teams/new')}
      onTeamClick={(id) => navigate(`/teams/${id}`)}
    />
  )
}
