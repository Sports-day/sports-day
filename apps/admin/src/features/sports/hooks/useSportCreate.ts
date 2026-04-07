import { useState } from 'react'
import { useCreateAdminSportMutation, GetAdminSportsDocument } from '@/gql/__generated__/graphql'

type SportCreateForm = {
  name: string
}

export function useSportCreate(onSave: () => void) {
  const [form, setForm] = useState<SportCreateForm>({ name: '' })
  const [createSport] = useCreateAdminSportMutation({
    refetchQueries: [{ query: GetAdminSportsDocument }],
  })

  const handleChange = (field: keyof SportCreateForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    await createSport({ variables: { input: { name: form.name } } })
    onSave()
  }

  return { form, handleChange, handleSubmit }
}
