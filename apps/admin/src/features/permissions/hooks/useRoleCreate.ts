import { useState } from 'react'

// 【未確定】Role CRUD の GraphQL API は未実装
export function useRoleCreate() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])

  const togglePermission = (key: string) => {
    setPermissions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleCreate = () => {
    // 【未確定】Role API 未実装
  }

  return { name, setName, description, setDescription, permissions, togglePermission, handleCreate }
}
