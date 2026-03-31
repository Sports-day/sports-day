import { useState } from 'react'
import { MOCK_LEAGUES_BY_COMPETITION, MOCK_LEAGUE_DETAILS, MOCK_TOURNAMENTS_BY_COMPETITION, persistCompetitionsData } from '../mock'
import { getCompetitionTag } from '@/lib/autoSync'

type CreateForm = {
  name: string
  description: string
  weight: number
  format: string
  scoringFormat: string
  tag: string
}

const INITIAL_FORM: CreateForm = {
  name: '',
  description: '',
  weight: 0,
  format: '',
  scoringFormat: '',
  tag: '',
}

export function useLeagueCreate(competitionId: string, type: 'league' | 'tournament', onSave: () => void) {
  const [form, setForm] = useState<CreateForm>(INITIAL_FORM)

  const handleChange = (field: keyof CreateForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'weight' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    const newId = String(Date.now())
    if (type === 'tournament') {
      if (!MOCK_TOURNAMENTS_BY_COMPETITION[competitionId]) {
        MOCK_TOURNAMENTS_BY_COMPETITION[competitionId] = []
      }
      MOCK_TOURNAMENTS_BY_COMPETITION[competitionId].push({ id: newId, name: form.name })
    } else {
      if (!MOCK_LEAGUES_BY_COMPETITION[competitionId]) {
        MOCK_LEAGUES_BY_COMPETITION[competitionId] = []
      }
      MOCK_LEAGUES_BY_COMPETITION[competitionId].push({ id: newId, name: form.name })
      MOCK_LEAGUE_DETAILS[newId] = {
        name: form.name, description: form.description, weight: String(form.weight),
        matchFormat: form.format || 'sunny', resultJudgments: [form.scoringFormat || 'score'],
        tag: getCompetitionTag(competitionId),
      }
    }
    persistCompetitionsData()
    onSave()
  }

  return { form, handleChange, handleSubmit }
}
