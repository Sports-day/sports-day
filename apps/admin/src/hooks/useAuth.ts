import { useSyncExternalStore } from 'react'
import { getAuth, subscribeAuth, getCurrentRole, hasPermission } from '@/lib/auth'

export function useAuth() {
  const auth = useSyncExternalStore(subscribeAuth, getAuth)

  return {
    loggedIn: auth.loggedIn,
    roleId: auth.roleId,
    role: getCurrentRole(),
    hasPermission,
  }
}
