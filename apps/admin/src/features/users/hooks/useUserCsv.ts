import { useState } from 'react'
import Papa from 'papaparse'
import {
  useGetAdminGroupsForClassesQuery,
  useBatchCreateAdminUsersMutation,
} from '@/gql/__generated__/graphql'
import { userManager } from '@/lib/userManager'
import { fetchMsGraphUsersByEmails } from '@/lib/graphApi'
import { showErrorToast } from '@/lib/toast'

export type UserCsvRow = {
  email: string
  class: string
  microsoftUserId: string | null
  status: string
}

export function useUserCsv() {
  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<UserCsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const { data: groupsData } = useGetAdminGroupsForClassesQuery()
  const [batchCreateUsers] = useBatchCreateAdminUsersMutation()

  const handleCsvChange = (value: string) => {
    setCsvText(value)

    const seenEmails = new Set<string>()
    const result = Papa.parse<string[]>(value, { skipEmptyLines: true })
    const parsed: UserCsvRow[] = result.data.map((parts) => {
      const email = (parts[0] ?? '').trim()
      const cls = (parts[1] ?? '').trim()

      if (!email) return { email, class: cls, microsoftUserId: null, status: 'メールが空です' }
      if (!cls) return { email, class: cls, microsoftUserId: null, status: 'クラスが空です' }
      if (seenEmails.has(email.toLowerCase()))
        return { email, class: cls, microsoftUserId: null, status: 'メールが重複しています（CSV内）' }

      seenEmails.add(email.toLowerCase())
      return { email, class: cls, microsoftUserId: null, status: '確認中' }
    })

    setRows(parsed)
  }

  const resolveUsers = async () => {
    const pendingRows = rows.filter((r) => r.status === '確認中')
    if (pendingRows.length === 0) return

    setLoading(true)
    try {
      const user = await userManager.getUser()
      if (!user?.access_token) {
        setRows((prev) =>
          prev.map((r) =>
            r.status === '確認中' ? { ...r, status: 'アクセストークン取得失敗' } : r,
          ),
        )
        return
      }

      const emails = pendingRows.map((r) => r.email)
      const msUsers = await fetchMsGraphUsersByEmails(user.access_token, emails)

      const groups = groupsData?.groups ?? []
      const groupNameToId = new Map(groups.map((g) => [g.name, g.id]))

      setRows((prev) =>
        prev.map((r) => {
          if (r.status !== '確認中') return r

          const msUser = msUsers.get(r.email.toLowerCase())
          if (!msUser) {
            return { ...r, status: 'テナントにユーザーが見つかりません' }
          }

          if (!groupNameToId.has(r.class)) {
            return { ...r, microsoftUserId: msUser.id, status: `クラス「${r.class}」が存在しません` }
          }

          return { ...r, microsoftUserId: msUser.id, status: '登録可能' }
        }),
      )
    } catch (e) {
      console.error('Graph API resolve failed:', e)
      setRows((prev) =>
        prev.map((r) =>
          r.status === '確認中' ? { ...r, status: 'Graph API エラー' } : r,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const groups = groupsData?.groups ?? []
    const groupNameToId = new Map(groups.map((g) => [g.name, g.id]))

    const registrable = rows.filter((r) => r.status === '登録可能' && r.microsoftUserId)
    if (registrable.length === 0) return

    try {
      await batchCreateUsers({
        variables: {
          input: {
            users: registrable.map((r) => ({
              microsoftUserId: r.microsoftUserId!,
              groupId: groupNameToId.get(r.class),
            })),
          },
        },
        refetchQueries: ['GetAdminUsers'],
      })
      setMutationError(null)
      setCsvText('')
      setRows([])
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  return { csvText, handleCsvChange, rows, resolveUsers, handleCreate, loading, error: mutationError }
}
