import { useNavigate } from 'react-router-dom'
import { ClassListPage } from '@/features/classes'

export default function ClassesPage() {
  const navigate = useNavigate()
  return (
    <ClassListPage
      onCreateClick={() => navigate('/classes/new')}
      onClassClick={(id) => navigate(`/classes/${id}`)}
    />
  )
}
