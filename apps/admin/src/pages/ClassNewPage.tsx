import { useNavigate } from 'react-router-dom'
import { ClassCreatePage } from '@/features/classes'

export default function ClassNewPage() {
  const navigate = useNavigate()
  return <ClassCreatePage onBack={() => navigate('/classes')} />
}
