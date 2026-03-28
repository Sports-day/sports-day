import { useState } from 'react'
import { MOCK_TEAMS } from '../../teams/mock'
import { MOCK_USERS } from '../mock'

const VALID_CLASSES = Array.from(new Set(MOCK_TEAMS.map((t) => t.class)))

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

    const parsed: UserCsvRow[] = value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split(',').map((s) => s.trim())
        const userName = parts[0] || '未登録'
        const email = parts[1] || '未登録'
        const gender = parts[2] || '未登録'
        const cls = parts[3] || '未登録'
        const status = VALID_CLASSES.includes(cls) ? '登録可能' : 'クラスがありません'
        return { userName, email, gender, class: cls, status }
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
    setCsvText('')
    setRows([])
  }

  return { csvText, handleCsvChange, rows, handleCreate }
}
