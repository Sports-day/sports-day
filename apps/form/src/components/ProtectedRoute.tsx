import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { User } from 'oidc-client-ts'
import { userManager } from '@/lib/userManager'

export default function ProtectedRoute() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'nologin'>('loading')

  useEffect(() => {
    userManager.getUser()
      .then((u) => (u && !u.expired ? u : userManager.signinSilent()))
      .then((u: User | null) => setStatus(u ? 'ok' : 'nologin'))
      .catch(() => setStatus('nologin'))
  }, [])

  if (status === 'loading') return null
  if (status === 'nologin') {
    userManager.signinRedirect()
    return null
  }
  return <Outlet />
}
