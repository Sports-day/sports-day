import { useNavigate } from 'react-router-dom'
import { CompetitionListPage } from './CompetitionListPage'

export function CompetitionsContainer() {
  const navigate = useNavigate()

  return (
    <CompetitionListPage
      onNavigateToCreate={() => navigate('/competitions/new')}
      onSelectCompetition={(id, name, type) => {
        navigate(`/competitions/${id}?type=${type}&name=${encodeURIComponent(name)}`)
      }}
    />
  )
}
