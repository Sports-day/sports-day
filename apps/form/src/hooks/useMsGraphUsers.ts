import { useEffect, useState } from 'react'
import { userManager } from '@/lib/userManager'
import { resolveUsers } from '@/lib/graphApi'
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
        // MS Graph APIの取得失敗はサイレントに処理（名前解決のフォールバックあり）
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
