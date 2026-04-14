import { useParams, useNavigate } from 'react-router-dom'
import { ClassDetailPage as ClassDetail } from '@/features/classes'

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/classes', { replace: true }); return null }
  return (
    <ClassDetail
      classId={id}
      onBack={() => navigate('/classes')}
    />
  )
}
