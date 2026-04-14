import { useNavigate } from 'react-router-dom'
import { UserCsvPage as UserCsvFeaturePage } from '@/features/users'

export default function UserCsvPage() {
  const navigate = useNavigate()
  return <UserCsvFeaturePage onBack={() => navigate('/users')} />
}
