import { useState, useEffect } from 'react'
import { userManager } from '@/lib/userManager'
import type { User } from 'oidc-client-ts'

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    userManager.getUser().then(setUser)
    userManager.events.addUserLoaded(setUser)
    userManager.events.addUserUnloaded(() => setUser(null))
    return () => {
      userManager.events.removeUserLoaded(setUser)
    }
  }, [])

  return {
    loggedIn: !!(user && !user.expired),
    loading: user === undefined,
    user,
  }
}
