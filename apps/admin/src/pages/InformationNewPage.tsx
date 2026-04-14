import { useNavigate } from 'react-router-dom'
import { InformationCreatePage } from '@/features/information'

export default function InformationNewPage() {
  const navigate = useNavigate()
  return <InformationCreatePage onBack={() => navigate('/information')} />
}
