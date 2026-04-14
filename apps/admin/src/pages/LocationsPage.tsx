import { useNavigate } from 'react-router-dom'
import { LocationListPage } from '@/features/locations'

export default function LocationsPage() {
  const navigate = useNavigate()
  return (
    <LocationListPage
      onNavigateToCreate={() => navigate('/locations/new')}
      onSelectLocation={(id) => navigate(`/locations/${id}`)}
    />
  )
}
