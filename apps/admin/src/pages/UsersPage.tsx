import { useNavigate } from 'react-router-dom'
import { UserListPage } from '@/features/users'

export default function UsersPage() {
  const navigate = useNavigate()
  return (
    <UserListPage
      onCsvCreate={() => navigate('/users/csv')}
      onUserClick={(id) => navigate(`/users/${id}`)}
    />
  )
}
