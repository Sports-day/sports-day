import { useNavigate } from 'react-router-dom'
import { TagCreatePage } from '@/features/tags'

export default function TagNewPage() {
  const navigate = useNavigate()
  return <TagCreatePage onBack={() => navigate('/tags')} />
}
