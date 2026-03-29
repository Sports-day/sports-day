import { useState } from 'react'
import { useLocationsStore } from './useLocationsStore'
import type { Location } from '../types'

export function useLocationDetail(location: Location, onSave: () => void, onDelete: () => void) {
  const { updateLocation, deleteLocation } = useLocationsStore()
  const [name, setName] = useState(location.name)
  const [note, setNote] = useState(location.description)

  const handleSave = () => {
    updateLocation(location.id, { name, description: note })
    onSave()
  }

  const handleDelete = () => {
    deleteLocation(location.id)
    onDelete()
  }

  return { name, note, setName, setNote, handleSave, handleDelete, loading: false, error: null }
}
