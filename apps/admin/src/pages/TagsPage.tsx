import { useNavigate } from 'react-router-dom'
import { TagListPage } from '@/features/tags'

export default function TagsPage() {
  const navigate = useNavigate()
  return (
    <TagListPage
      onCreateClick={() => navigate('/tags/new')}
      onTagClick={(id) => navigate(`/tags/${id}`)}
    />
  )
}
