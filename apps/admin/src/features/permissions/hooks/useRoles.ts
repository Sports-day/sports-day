import { useState } from 'react'
import { MOCK_ROLES } from '../mock'
import type { Role } from '../types'

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES)

  const toggleDefault = (id: string) => {
    const role = MOCK_ROLES.find((r) => r.id === id)
    if (role) role.isDefault = !role.isDefault
    setRoles([...MOCK_ROLES])
  }

  return { data: roles, loading: false, error: null, toggleDefault }
}
