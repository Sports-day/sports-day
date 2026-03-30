import { useState } from 'react'
import { MOCK_ROLES, persistRoles } from '../mock'

export function useRoleCreate() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    const newId = String(Date.now())
    MOCK_ROLES.push({ id: newId, name, description, isDefault: false })
    persistRoles()
    setName('')
    setDescription('')
  }

  return { name, setName, description, setDescription, handleCreate }
}
