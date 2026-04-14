import { useNavigate } from 'react-router-dom'
import { InformationListPage } from '@/features/information'

export default function InformationPage() {
  const navigate = useNavigate()
  return (
    <InformationListPage
      onCreateClick={() => navigate('/information/new')}
      onAnnouncementClick={(id) => navigate(`/information/${id}`)}
    />
  )
}
