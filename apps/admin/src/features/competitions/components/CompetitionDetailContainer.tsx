import { useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useResetToList } from '@/hooks/useResetToList'
import { LeagueDetailPage } from './LeagueDetailPage'
import { TournamentDetailPage } from './TournamentDetailPage'

export function CompetitionDetailContainer() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const type = searchParams.get('type')
  const name = searchParams.get('name') ?? ''

  const handleBack = useCallback(() => navigate('/competitions'), [navigate])

  // サイドバーで「大会」を再クリックしたとき一覧へ戻す
  useResetToList(false, handleBack)

  const handleSaved = useCallback(
    (newName: string) => {
      setSearchParams({ type: type ?? 'TOURNAMENT', name: newName }, { replace: true })
    },
    [type, setSearchParams],
  )

  if (!id) {
    navigate('/competitions', { replace: true })
    return null
  }

  if (type === 'LEAGUE') {
    return (
      <LeagueDetailPage
        leagueId={id}
        leagueName={name}
        competitionId={id}
        competitionName={name}
        onBackToList={handleBack}
        onBackToDetail={handleBack}
        onSaved={handleSaved}
        onDeleted={handleBack}
      />
    )
  }

  return (
    <TournamentDetailPage
      tournamentId={id}
      tournamentName={name}
      competitionId={id}
      competitionName={name}
      onBackToList={handleBack}
      onBackToDetail={handleBack}
      onSaved={handleSaved}
      onDeleted={handleBack}
    />
  )
}
