import { useState } from 'react'
import { useCreateAdminLocationMutation, GetAdminLocationsDocument } from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

type LocationCreateForm = {
  name: string
}

export function useLocationCreate(onSave: () => void) {
  const [form, setForm] = useState<LocationCreateForm>({ name: '' })
  const [createLocation] = useCreateAdminLocationMutation({
    refetchQueries: [{ query: GetAdminLocationsDocument }],
  })

  const handleChange = (field: keyof LocationCreateForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    try {
      await createLocation({ variables: { input: { name: form.name.slice(0, 64) } } })
      onSave()
    } catch (e) {
      showErrorToast()
      throw e
    }
  }

  return { form, handleChange, handleSubmit }
}
