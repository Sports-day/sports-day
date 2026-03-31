import { useEffect, useState } from 'react'
import { getAuth, subscribeAuth, getCurrentRole, hasPermission } from '@/lib/auth'

export function useAuth() {
  const [, rerender] = useState(0)

  useEffect(() => subscribeAuth(() => rerender((n) => n + 1)), [])

  const auth = getAuth()

  return {
    loggedIn: auth.loggedIn,
    roleId: auth.roleId,
    role: getCurrentRole(),
    hasPermission,
  }
}
