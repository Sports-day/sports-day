import { useState } from 'react'
import { useLocationsStore } from './useLocationsStore'

export function useLocationDetail(locationId: string, onSave: () => void, onDelete: () => void) {
  const { locations, updateLocation, deleteLocation } = useLocationsStore()
  const location = locations.find((l) => l.id === locationId)
  const [name, setName] = useState(location?.name ?? '')
  const [note, setNote] = useState(location?.description ?? '')

  const handleSave = () => {
    updateLocation(locationId, { name, description: note })
    onSave()
  }

  const handleDelete = () => {
    deleteLocation(locationId)
    onDelete()
  }

  return { location, name, note, setName, setNote, handleSave, handleDelete }
}
