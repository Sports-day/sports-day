import { useState } from 'react'
import { MOCK_ROLES, persistRoles } from '../mock'

export function useRoleDetail(roleId: string) {
  const role = MOCK_ROLES.find(r => r.id === roleId)
  const [name, setName] = useState(role?.name ?? '')
  const [description, setDescription] = useState(role?.description ?? '')
  const [isDefault, setIsDefault] = useState(role?.isDefault ?? false)

  const handleSave = () => {
    const target = MOCK_ROLES.find(r => r.id === roleId)
    if (target) {
      target.name = name
      target.description = description
      target.isDefault = isDefault
    }
    persistRoles()
  }

  const handleDelete = () => {
    const index = MOCK_ROLES.findIndex(r => r.id === roleId)
    if (index !== -1) MOCK_ROLES.splice(index, 1)
    persistRoles()
  }

  return {
    roleName: role?.name ?? '',
    roleId: role?.id ?? '',
    name,
    setName,
    description,
    setDescription,
    isDefault,
    setIsDefault,
    handleSave,
    handleDelete,
    loading: false,
    error: null,
  }
}
