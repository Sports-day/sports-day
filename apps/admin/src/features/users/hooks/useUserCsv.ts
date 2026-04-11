import { useState } from 'react'
import Papa from 'papaparse'
import {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
} from '@/gql/__generated__/graphql'
import { showErrorToast } from '@/lib/toast'

export type UserCsvRow = {
  userName: string
  email: string
  class: string
  status: string
}

export function useUserCsv() {
  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<UserCsvRow[]>([])
  const [mutationError, setMutationError] = useState<Error | null>(null)

  const { data: usersData } = useGetAdminUsersQuery()
  const [createUser] = useCreateAdminUserMutation()

  const handleCsvChange = (value: string) => {
    setCsvText(value)

    const existingEmails = new Set((usersData?.users ?? []).map(u => u.email))
    const seenEmails = new Set<string>()

    const result = Papa.parse<string[]>(value, { skipEmptyLines: true })
    const parsed: UserCsvRow[] = result.data.map((parts) => {
      const userName = (parts[0] ?? '').trim()
      const email = (parts[1] ?? '').trim()
      const cls = (parts[2] ?? '').trim()

      if (!userName) return { userName, email, class: cls, status: '名前が空です' }
      if (!email) return { userName, email, class: cls, status: 'メールが空です' }
      if (existingEmails.has(email)) return { userName, email, class: cls, status: 'メールが重複しています（既存）' }
      if (seenEmails.has(email)) return { userName, email, class: cls, status: 'メールが重複しています（CSV内）' }

      seenEmails.add(email)
      return { userName, email, class: cls, status: '登録可能' }
    })

    setRows(parsed)
  }

  const handleCreate = async () => {
    const registrable = rows.filter((r) => r.status === '登録可能')
    try {
      for (const r of registrable) {
        await createUser({
          variables: {
            input: {
              name: r.userName,
              email: r.email,
            },
          },
          refetchQueries: ['GetAdminUsers'],
        })
      }
      setMutationError(null)
      setCsvText('')
      setRows([])
    } catch (e) {
      setMutationError(e instanceof Error ? e : new Error(String(e)))
      showErrorToast()
    }
  }

  return { csvText, handleCsvChange, rows, handleCreate, error: mutationError }
}
