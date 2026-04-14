import { useParams, useNavigate } from 'react-router-dom'
import { InformationDetailPage as InformationDetail } from '@/features/information'

export default function InformationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  if (!id) { navigate('/information', { replace: true }); return null }
  return (
    <InformationDetail
      announcementId={id}
      onBack={() => navigate('/information')}
    />
  )
}
