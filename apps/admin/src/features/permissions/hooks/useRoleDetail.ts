import { useState } from 'react'

// 【未確定】Role CRUD の GraphQL API は未実装
export function useRoleDetail(roleId: string) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [permissions, setPermissions] = useState<string[]>([])

  const togglePermission = (key: string) => {
    setPermissions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleSave = () => {
    // 【未確定】Role API 未実装
  }

  const handleDelete = () => {
    // 【未確定】Role API 未実装
  }

  return {
    roleName: '',
    roleId,
    name,
    setName,
    description,
    setDescription,
    isDefault,
    setIsDefault,
    permissions,
    togglePermission,
    handleSave,
    handleDelete,
    loading: false,
    error: null,
  }
}
