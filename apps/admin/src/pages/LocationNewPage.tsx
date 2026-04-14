import { useNavigate } from 'react-router-dom'
import { LocationCreatePage } from '@/features/locations'

export default function LocationNewPage() {
  const navigate = useNavigate()
  return (
    <LocationCreatePage
      onBack={() => navigate('/locations')}
      onSave={() => navigate('/locations')}
    />
  )
}
