import { useState } from 'react'
import { MOCK_LEAGUES_BY_COMPETITION } from '../mock'

type LeagueCreateForm = {
  name: string
  description: string
  weight: number
  format: string
  scoringFormat: string
  tag: string
}

const INITIAL_FORM: LeagueCreateForm = {
  name: '',
  description: '',
  weight: 0,
  format: '',
  scoringFormat: '',
  tag: '',
}

export function useLeagueCreate(competitionId: string, onSave: () => void) {
  const [form, setForm] = useState<LeagueCreateForm>(INITIAL_FORM)

  const handleChange = (field: keyof LeagueCreateForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'weight' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    const newId = String(Date.now())
    if (!MOCK_LEAGUES_BY_COMPETITION[competitionId]) {
      MOCK_LEAGUES_BY_COMPETITION[competitionId] = []
    }
    MOCK_LEAGUES_BY_COMPETITION[competitionId].push({ id: newId, name: form.name })
    onSave()
  }

  return { form, handleChange, handleSubmit }
}
