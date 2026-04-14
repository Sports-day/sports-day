import { useParams, useNavigate } from 'react-router-dom'
import { UserDetailPage as UserDetail } from '@/features/users'

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/users', { replace: true }); return null }
  return (
    <UserDetail
      userId={id}
      onBack={() => navigate('/users')}
    />
  )
}
