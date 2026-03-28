import { useState } from 'react'
import { MOCK_ROLES } from '../mock'

export function useRoleCreate() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    const newId = String(MOCK_ROLES.length + 1)
    MOCK_ROLES.push({ id: newId, name, description, isDefault: false })
    setName('')
    setDescription('')
  }

  return { name, setName, description, setDescription, handleCreate }
}
