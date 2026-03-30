import { useState } from 'react'
import { MOCK_TOURNAMENT_DETAILS, MOCK_TOURNAMENTS_BY_COMPETITION, persistCompetitionsData } from '../mock'
import { generateTournamentData } from './useTournamentCreate'

type PlacementMethod = 'SEED_OPTIMIZED' | 'BALANCED' | 'RANDOM' | 'MANUAL'

export function useTournamentEdit(tournamentId: string, _competitionId: string) {
  const detail = MOCK_TOURNAMENT_DETAILS[tournamentId]

  const [name, setName] = useState(detail?.name ?? '')
  const [description, setDescription] = useState(detail?.description ?? '')
  const [teamCount, setTeamCount] = useState(detail?.teamCount ?? 4)
  const [hasThirdPlace, setHasThirdPlace] = useState(detail?.hasThirdPlace ?? false)
  const [hasFifthPlace, setHasFifthPlace] = useState(detail?.hasFifthPlace ?? false)
  const [placementMethod, setPlacementMethod] = useState<PlacementMethod>(detail?.placementMethod ?? 'SEED_OPTIMIZED')
  const [tag, setTag] = useState(detail?.tag ?? '')

  const handleChange =
    (field: 'name' | 'description' | 'tag' | 'teamCount' | 'placementMethod') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (field === 'name') setName(e.target.value)
      else if (field === 'description') setDescription(e.target.value)
      else if (field === 'tag') setTag(e.target.value)
      else if (field === 'teamCount') setTeamCount(Number(e.target.value))
      else if (field === 'placementMethod') setPlacementMethod(e.target.value as PlacementMethod)
    }

  const handleToggle = (field: 'hasThirdPlace' | 'hasFifthPlace') => {
    if (field === 'hasThirdPlace') setHasThirdPlace((v) => !v)
    else setHasFifthPlace((v) => !v)
  }

  const handleSave = () => {
    if (!detail) return

    // ブラケット構造を再生成して全フィールドを更新
    const newData = generateTournamentData(
      { name, description, teamCount, hasThirdPlace, hasFifthPlace, placementMethod, tag },
      tournamentId,
    )
    detail.name = newData.name
    detail.description = newData.description
    detail.teamCount = newData.teamCount
    detail.hasThirdPlace = newData.hasThirdPlace
    detail.hasFifthPlace = newData.hasFifthPlace
    detail.placementMethod = newData.placementMethod
    detail.tag = newData.tag
    detail.brackets = newData.brackets

    // MOCK_TOURNAMENTS_BY_COMPETITION の name も更新
    for (const list of Object.values(MOCK_TOURNAMENTS_BY_COMPETITION)) {
      const t = list.find((t) => t.id === tournamentId)
      if (t) { t.name = name; break }
    }
    persistCompetitionsData()
  }

  return {
    name,
    description,
    teamCount,
    hasThirdPlace,
    hasFifthPlace,
    placementMethod,
    tag,
    handleChange,
    handleToggle,
    handleSave,
  }
}
