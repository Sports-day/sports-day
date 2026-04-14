import { useParams, useNavigate } from 'react-router-dom'
import { TagDetailPage as TagDetail } from '@/features/tags'

export default function TagDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/tags', { replace: true }); return null }
  return (
    <TagDetail
      tagId={id}
      onBack={() => navigate('/tags')}
    />
  )
}
