import { useNavigate } from 'react-router-dom'
import { CompetitionCreatePage } from '@/features/competitions'
import type { CompetitionType } from '@/gql/__generated__/graphql'

export default function CompetitionNewPage() {
  const navigate = useNavigate()
  return (
    <CompetitionCreatePage
      onBack={() => navigate('/competitions')}
      onSave={(id: string, name: string, type: CompetitionType) => {
        navigate(`/competitions/${id}?type=${type}&name=${encodeURIComponent(name)}`)
      }}
    />
  )
}
