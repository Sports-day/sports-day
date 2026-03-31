import { useState } from 'react'
import { MOCK_USERS, persistUsers } from '../mock'
import { notifyUserListeners } from './useUsers'

const VALID_GENDERS = ['男性', '女性']

export type UserCsvRow = {
  userName: string
  email: string
  gender: string
  class: string
  status: string
}

export function useUserCsv() {
  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<UserCsvRow[]>([])

  const handleCsvChange = (value: string) => {
    setCsvText(value)

    const existingEmails = new Set(MOCK_USERS.map(u => u.email))
    const seenEmails = new Set<string>()

    const parsed: UserCsvRow[] = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split(',').map((s) => s.trim())
        const userName = parts[0] ?? ''
        const email = parts[1] ?? ''
        const gender = parts[2] ?? ''
        const cls = parts[3] ?? ''

        if (!userName) return { userName, email, gender, class: cls, status: '名前が空です' }
        if (!email) return { userName, email, gender, class: cls, status: 'メールが空です' }
        if (!VALID_GENDERS.includes(gender)) return { userName, email, gender, class: cls, status: '性別が不正です（男性/女性）' }
        if (existingEmails.has(email)) return { userName, email, gender, class: cls, status: 'メールが重複しています（既存）' }
        if (seenEmails.has(email)) return { userName, email, gender, class: cls, status: 'メールが重複しています（CSV内）' }

        seenEmails.add(email)
        return { userName, email, gender, class: cls, status: '登録可能' }
      })

    setRows(parsed)
  }

  const handleCreate = () => {
    rows
      .filter((r) => r.status === '登録可能')
      .forEach((r) => {
        MOCK_USERS.push({
          id: String(Date.now() + Math.random()),
          name: r.userName,
          email: r.email,
          gender: r.gender === '男性' ? '男性' : '女性',
          class: r.class,
          teams: [],
        })
      })
    persistUsers()
    notifyUserListeners()
    setCsvText('')
    setRows([])
  }

  return { csvText, handleCsvChange, rows, handleCreate }
}
