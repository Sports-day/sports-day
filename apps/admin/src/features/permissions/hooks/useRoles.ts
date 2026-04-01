import { useState, useEffect } from 'react'
import { MOCK_ROLES, persistRoles } from '../mock'
import type { Role } from '../types'

const _listeners = new Set<() => void>()

export function notifyRoleListeners() {
  _listeners.forEach(fn => fn())
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES)

  useEffect(() => {
    const trigger = () => setRoles([...MOCK_ROLES])
    _listeners.add(trigger)
    return () => { _listeners.delete(trigger) }
  }, [])

  const toggleDefault = (id: string) => {
    const role = MOCK_ROLES.find((r) => r.id === id)
    if (!role) return
    if (role.isDefault) return // デフォルトロールの解除は禁止
    MOCK_ROLES.forEach((r) => { r.isDefault = false })
    role.isDefault = true
    persistRoles()
    setRoles([...MOCK_ROLES])
  }

  return { data: roles, loading: false, error: null, toggleDefault }
}
