import { useState } from 'react'
import { MOCK_ROLES, persistRoles } from '../mock'
import { notifyRoleListeners } from './useRoles'

export function useRoleCreate() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])

  const togglePermission = (key: string) => {
    setPermissions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleCreate = () => {
    const newId = String(Date.now())
    MOCK_ROLES.push({ id: newId, name, description, isDefault: false, permissions })
    persistRoles()
    notifyRoleListeners()
    setName('')
    setDescription('')
    setPermissions([])
  }

  return { name, setName, description, setDescription, permissions, togglePermission, handleCreate }
}
