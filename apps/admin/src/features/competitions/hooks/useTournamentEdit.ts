import { useState } from 'react'
import { useGetAdminTournamentQuery } from '@/gql/__generated__/graphql'
import { generateTournamentData } from './useTournamentCreate'

type PlacementMethod = 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'

export function useTournamentEdit(tournamentId: string) {
  // 【未確定】 updateTournament mutation が GraphQL スキーマに存在しないため保存は未実装
  const { data } = useGetAdminTournamentQuery({
    variables: { id: tournamentId },
    skip: !tournamentId,
  })
  const tournament = data?.tournament

  const [name, setName] = useState(tournament?.name ?? '')
  const [description, setDescription] = useState('')
  const [teamCount, setTeamCount] = useState(tournament?.slots.length ?? 4)
  const [placementMethod, setPlacementMethod] = useState<PlacementMethod>(
    (tournament?.placementMethod ?? 'SEED_OPTIMIZED') as PlacementMethod
  )
  const [tag, setTag] = useState('')

  const handleChange =
    (field: 'name' | 'description' | 'tag' | 'teamCount' | 'placementMethod') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === 'name') setName(e.target.value)
      else if (field === 'description') setDescription(e.target.value)
      else if (field === 'tag') setTag(e.target.value)
      else if (field === 'teamCount') setTeamCount(Number(e.target.value))
      else if (field === 'placementMethod') setPlacementMethod(e.target.value as PlacementMethod)
    }

  const handleSave = () => {
    // 【未確定】 updateTournament mutation が実装されたら以下で置き換え
    // ブラケット生成ロジックはローカルで保持
    generateTournamentData({ name, description, teamCount, placementMethod, tag }, tournamentId)
  }

  return {
    name,
    description,
    teamCount,
    placementMethod,
    tag,
    handleChange,
    handleSave,
  }
}
