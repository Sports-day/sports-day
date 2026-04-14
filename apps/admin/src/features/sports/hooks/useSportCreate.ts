import { useState } from 'react'
import { useCreateAdminSportMutation, GetAdminSportsDocument } from '@/gql/__generated__/graphql'
import { showApiErrorToast } from '@/lib/toast'

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
    try {
      await createSport({ variables: { input: { name: form.name.slice(0, 64) } } })
      onSave()
    } catch (e) {
      showApiErrorToast(e)
      throw e
    }
  }

  return { form, handleChange, handleSubmit }
}
