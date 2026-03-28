import { useState } from 'react'
import { MOCK_LOCATIONS } from '../mock'
import type { Location } from '../types'

export function useLocationDetail(location: Location, onSave: () => void, onDelete: () => void) {
  const [name, setName] = useState(location.name)
  const [note, setNote] = useState(location.description)

  const handleSave = () => {
    const target = MOCK_LOCATIONS.find(l => l.id === location.id)
    if (target) {
      target.name = name
      target.description = note
    }
    onSave()
  }

  const handleDelete = () => {
    const index = MOCK_LOCATIONS.findIndex(l => l.id === location.id)
    if (index !== -1) MOCK_LOCATIONS.splice(index, 1)
    onDelete()
  }

  return { name, note, setName, setNote, handleSave, handleDelete, loading: false, error: null }
}
