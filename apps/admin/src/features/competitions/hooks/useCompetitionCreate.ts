import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { MOCK_COMPETITIONS, persistCompetitionsData } from '../mock'

type CompetitionCreateForm = {
  name: string
  description: string
  icon: string
  tag: string
}

export function useCompetitionCreate(onSuccess: (name: string) => void) {
  const [form, setForm] = useState<CompetitionCreateForm>({
    name: '',
    description: '',
    icon: '',
    tag: '',
  })

  const handleChange = (field: keyof CompetitionCreateForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    const newId = String(Date.now())
    MOCK_COMPETITIONS.push({ id: newId, name: form.name })
    persistCompetitionsData()
    onSuccess(form.name)
  }

  return { form, handleChange, handleSubmit }
}
