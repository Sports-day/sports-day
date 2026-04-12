import { useState, useEffect } from 'react'
import { userManager } from '@/lib/userManager'
import type { User } from 'oidc-client-ts'

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    userManager.getUser().then(setUser)
    const handleUnloaded = () => setUser(null)
    userManager.events.addUserLoaded(setUser)
    userManager.events.addUserUnloaded(handleUnloaded)
    return () => {
      userManager.events.removeUserLoaded(setUser)
      userManager.events.removeUserUnloaded(handleUnloaded)
    }
  }, [])

  return {
    loggedIn: !!(user && !user.expired),
    loading: user === undefined,
    user,
  }
}
