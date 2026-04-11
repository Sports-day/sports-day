import { useEffect, useRef, useState } from 'react'
import { userManager } from '@/src/lib/userManager'
import { fetchMsGraphUsers } from '@/src/lib/graphApi'
import type { MsGraphUser } from '@/src/lib/graphApi'

export function useMsGraphUsers(microsoftUserIds: string[]) {
  const [msGraphUsers, setMsGraphUsers] = useState<Map<string, MsGraphUser>>(
    new Map(),
  )
  const [loading, setLoading] = useState(false)
  const cacheRef = useRef<Map<string, MsGraphUser>>(new Map())

  const filtered = microsoftUserIds.filter(Boolean)
  const sortedKey = [...new Set(filtered)].sort().join(',')

  useEffect(() => {
    if (!sortedKey) {
      setMsGraphUsers(new Map())
      return
    }

    const ids = sortedKey.split(',')
    const uncachedIds = ids.filter((id) => !cacheRef.current.has(id))

    if (uncachedIds.length === 0) {
      const cached = new Map<string, MsGraphUser>()
      for (const id of ids) {
        const u = cacheRef.current.get(id)
        if (u) cached.set(id, u)
      }
      setMsGraphUsers(cached)
      return
    }

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const user = await userManager.getUser()
        if (!user?.access_token || cancelled) return

        const fetched = await fetchMsGraphUsers(user.access_token, uncachedIds)
        if (cancelled) return

        for (const [id, u] of fetched) {
          cacheRef.current.set(id, u)
        }

        const merged = new Map<string, MsGraphUser>()
        for (const id of ids) {
          const u = cacheRef.current.get(id)
          if (u) merged.set(id, u)
        }
        setMsGraphUsers(merged)
      } catch (e) {
        console.error('Failed to fetch MS Graph users:', e)
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
