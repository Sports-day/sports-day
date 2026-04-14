import { useNavigate } from 'react-router-dom'
import { SportListPage } from '@/features/sports'

export default function SportsPage() {
  const navigate = useNavigate()
  return (
    <SportListPage
      onNavigateToCreate={() => navigate('/sports/new')}
      onSelectSport={(id) => navigate(`/sports/${id}`)}
    />
  )
}
