import { useState } from 'react'
import { useLocationsStore } from './useLocationsStore'

type LocationCreateForm = {
  name: string
  note: string
}

export function useLocationCreate(onSave: () => void) {
  const { addLocation } = useLocationsStore()
  const [form, setForm] = useState<LocationCreateForm>({ name: '', note: '' })

  const handleChange = (field: keyof LocationCreateForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    addLocation({
      id: String(Date.now()),
      name: form.name,
      description: form.note,
    })
    onSave()
  }

  return { form, handleChange, handleSubmit }
}
