import { useEffect, useState } from 'react'
import { userManager } from '@/src/lib/userManager'
import { resolveUsers } from '@/src/lib/graphApi'
import type { MsGraphUser } from '@/src/lib/graphApi'

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
        // MS Graph API失敗はサイレントに処理（表示名がフォールバック値になる）
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
