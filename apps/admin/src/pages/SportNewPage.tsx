import { useNavigate } from 'react-router-dom'
import { SportCreatePage } from '@/features/sports'

export default function SportNewPage() {
  const navigate = useNavigate()
  return (
    <SportCreatePage
      onBack={() => navigate('/sports')}
      onSave={() => navigate('/sports')}
    />
  )
}
