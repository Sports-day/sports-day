import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { MOCK_COMPETITIONS, persistCompetitionsData } from '../mock'
import { inheritCompetitionTag } from '@/lib/autoSync'

type EditForm = {
  name: string
  description: string
  icon: string
  tag: string
}

export function useCompetitionEdit(competitionId: string) {
  const competition = MOCK_COMPETITIONS.find((c) => c.id === competitionId)
  const [form, setForm] = useState<EditForm>({
    name: competition?.name ?? '',
    description: competition?.description ?? '',
    icon: competition?.icon ?? '',
    tag: competition?.tag ?? '',
  })

  const handleChange = (field: keyof EditForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = () => {
    const target = MOCK_COMPETITIONS.find((c) => c.id === competitionId)
    if (!target || !form.name.trim()) return
    target.name = form.name.trim()
    target.description = form.description
    target.icon = form.icon
    target.tag = form.tag
    persistCompetitionsData()
    inheritCompetitionTag(competitionId)
  }

  const handleDelete = () => {
    const index = MOCK_COMPETITIONS.findIndex((c) => c.id === competitionId)
    if (index !== -1) {
      MOCK_COMPETITIONS.splice(index, 1)
      persistCompetitionsData()
    }
  }

  return { form, handleChange, handleSave, handleDelete }
}
