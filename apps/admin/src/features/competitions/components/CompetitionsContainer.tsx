import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompetitionListPage } from './CompetitionListPage'
import { CompetitionCreatePage } from './CompetitionCreatePage'
import { LeagueDetailPage } from './LeagueDetailPage'
import { TournamentDetailPage } from './TournamentDetailPage'
import { CompetitionType } from '@/gql/__generated__/graphql'
import { useResetToList } from '@/hooks/useResetToList'

type View = 'list' | 'create' | 'league-detail' | 'tournament-detail'

export function CompetitionsContainer() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 試合詳細からの戻り先ディープリンク（?competitionId=xxx&competitionName=xxx&type=TOURNAMENT）
  const [view, setView] = useState<View>(() => {
    const cid = searchParams.get('competitionId')
    const cname = searchParams.get('competitionName')
    const ctype = searchParams.get('type')
    if (cid && cname) return ctype === 'LEAGUE' ? 'league-detail' : 'tournament-detail'
    return 'list'
  })
  const [competitionId, setCompetitionId] = useState(() => searchParams.get('competitionId') ?? '')
  const [competitionName, setCompetitionName] = useState(() => searchParams.get('competitionName') ?? '')

  // ディープリンクで開いた場合はURLパラメータをクリア
  useEffect(() => {
    if (searchParams.get('competitionId')) {
      setSearchParams({}, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useResetToList(view === 'list', useCallback(() => setView('list'), []))

  if (view === 'league-detail') {
    return (
      <LeagueDetailPage
        leagueId={competitionId}
        leagueName={competitionName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('list')}
        onSaved={(newName) => setCompetitionName(newName)}
        onDeleted={() => setView('list')}
      />
    )
  }

  if (view === 'tournament-detail') {
    return (
      <TournamentDetailPage
        tournamentId={competitionId}
        tournamentName={competitionName}
        competitionId={competitionId}
        competitionName={competitionName}
        onBackToList={() => setView('list')}
        onBackToDetail={() => setView('list')}
        onSaved={(newName) => setCompetitionName(newName)}
        onDeleted={() => setView('list')}
      />
    )
  }

  if (view === 'create') {
    return (
      <CompetitionCreatePage
        onBack={() => setView('list')}
        onSave={(id, name, type) => {
          setCompetitionId(id)
          setCompetitionName(name)
          if (type === CompetitionType.League) {
            setView('league-detail')
          } else {
            setView('tournament-detail')
          }
        }}
      />
    )
  }

  return (
    <CompetitionListPage
      onNavigateToCreate={() => setView('create')}
      onSelectCompetition={(id, name, type) => {
        setCompetitionId(id)
        setCompetitionName(name)
        if (type === 'LEAGUE') {
          setView('league-detail')
        } else {
          setView('tournament-detail')
        }
      }}
    />
  )
}
