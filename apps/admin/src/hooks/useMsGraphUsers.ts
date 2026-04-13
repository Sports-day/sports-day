import { useEffect, useState } from 'react'
import { userManager } from '@/lib/userManager'
import { resolveUsers, resolveUser } from '@/lib/graphApi'
import type { MsGraphUser } from '@/lib/graphApi'

export function useMsGraphUsers(microsoftUserIds: string[]) {
  const [msGraphUsers, setMsGraphUsers] = useState<Map<string, MsGraphUser>>(
    new Map(),
  )
  const [loading, setLoading] = useState(false)

  const filtered = microsoftUserIds.filter(Boolean)
  const sortedKey = [...new Set(filtered)].sort().join(',')

  useEffect(() => {
    if (!sortedKey) {
      setMsGraphUsers(new Map())
      return
    }

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const user = await userManager.getUser()
        if (!user?.access_token || cancelled) return

        const ids = sortedKey.split(',')
        const result = await resolveUsers(user.access_token, ids)
        if (cancelled) return

        setMsGraphUsers(result)
      } catch {
        // Graph API fetch failed - silently handled
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sortedKey])

  return { msGraphUsers, loading }
}

export function useMsGraphUser(microsoftUserId: string | null | undefined) {
  const [msGraphUser, setMsGraphUser] = useState<MsGraphUser | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!microsoftUserId) {
      setMsGraphUser(null)
      return
    }

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const user = await userManager.getUser()
        if (!user?.access_token || cancelled) return

        const result = await resolveUser(user.access_token, microsoftUserId)
        if (cancelled) return

        setMsGraphUser(result)
      } catch {
        // Graph API fetch failed - silently handled
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [microsoftUserId])

  return { msGraphUser, loading }
}
